import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'
import BottomNav from '../components/BottomNav'
import toast from 'react-hot-toast'
import { supabase } from '../../../lib/supabaseClient'
import { Clock, CheckCircle2, ArrowLeft, RefreshCw, History } from 'lucide-react'

export default function ClockInOut() {
  const { user, profile } = useAuthStore()
  const navigate = useNavigate()
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [employeeId, setEmployeeId] = useState(null)
  const [clockInTime, setClockInTime] = useState(null)
  const [clockOutTime, setClockOutTime] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    initClock()
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const initClock = async () => {
    setLoading(true)
    
    // Step 1: Get or create employee
    const empId = await getEmployeeId()
    if (!empId) {
      setLoading(false)
      toast.error('Could not set up profile')
      return
    }
    setEmployeeId(empId)
    
    // Step 2: Check today's attendance
    await checkTodayStatus(empId)
    
    // Step 3: Load history
    await loadHistory(empId)
    
    setLoading(false)
  }

  const getEmployeeId = async () => {
    // Try user_id
    let { data: emp } = await supabase.from('employees').select('id').eq('user_id', user?.id).single()
    if (emp) return emp.id
    
    // Try email
    const { data: empEmail } = await supabase.from('employees').select('id').eq('email', user?.email).single()
    if (empEmail) {
      await supabase.from('employees').update({ user_id: user?.id }).eq('id', empEmail.id)
      return empEmail.id
    }
    
    // Create new
    const { data: newEmp } = await supabase.from('employees').insert([{
      user_id: user?.id,
      first_name: profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Staff',
      last_name: profile?.full_name?.split(' ').slice(1).join(' ') || '',
      email: user?.email,
      employment_status: 'active',
      department: 'Operations'
    }]).select('id').single()
    
    return newEmp?.id || null
  }

  const checkTodayStatus = async (empId) => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', empId)
      .eq('attendance_date', today)
      .single()

    if (data) {
      setClockInTime(data.clock_in_time)
      setClockOutTime(data.clock_out_time)
      setIsClockedIn(!!data.clock_in_time && !data.clock_out_time)
    } else {
      setClockInTime(null)
      setClockOutTime(null)
      setIsClockedIn(false)
    }
  }

  const loadHistory = async (empId) => {
    const { data } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', empId)
      .order('attendance_date', { ascending: false })
      .limit(7)
    setHistory(data || [])
  }

  const handleClockIn = async () => {
    if (!employeeId || isClockedIn) return
    setProcessing(true)

    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()

    const { error } = await supabase.from('attendance_records').upsert({
      employee_id: employeeId,
      attendance_date: today,
      clock_in_time: now,
      clock_out_time: null,
      check_in_method: 'mobile_app',
      status: 'present'
    }, { onConflict: 'employee_id,attendance_date' })

    if (error) {
      toast.error('Failed: ' + error.message)
    } else {
      setIsClockedIn(true)
      setClockInTime(now)
      setClockOutTime(null)
      toast.success('Clocked in! 🟢')
      loadHistory(employeeId)
    }
    setProcessing(false)
  }

  const handleClockOut = async () => {
    if (!employeeId || !isClockedIn) return
    setProcessing(true)

    const today = new Date().toISOString().split('T')[0]
    const now = new Date().toISOString()

    const { error } = await supabase
      .from('attendance_records')
      .update({ clock_out_time: now, check_out_method: 'mobile_app' })
      .eq('employee_id', employeeId)
      .eq('attendance_date', today)

    if (error) {
      toast.error('Failed: ' + error.message)
    } else {
      setIsClockedIn(false)
      setClockOutTime(now)
      toast.success('Clocked out! 👋')
      loadHistory(employeeId)
    }
    setProcessing(false)
  }

  const fmtTime = (d) => d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const fmtDate = (d) => d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })
  const fmtTimeStr = (s) => s ? new Date(s).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '--:--'
  const fmtDateStr = (s) => s ? new Date(s+'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' }) : '--'

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20">
      <div className="bg-gradient-to-b from-amber-500 to-amber-600 px-4 pt-8 pb-6 text-white">
        <button onClick={() => navigate('/mobile')} className="p-1 rounded-lg hover:bg-white/20 mb-4"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl font-bold">Clock In / Out</h1>
        <p className="text-amber-100 text-sm">{fmtDate(currentTime)}</p>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6">
          <p className="text-slate-500 text-sm mb-2">Current Time</p>
          <p className="text-5xl font-bold text-slate-800 font-mono">{fmtTime(currentTime)}</p>
        </div>

        {loading ? (
          <div className="text-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600 mx-auto"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={handleClockIn} disabled={isClockedIn || processing}
                className={`rounded-3xl p-6 text-center transition-all ${isClockedIn ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg active:scale-95'}`}>
                <Clock className="w-10 h-10 mx-auto mb-2" />
                <p className="font-bold text-lg">CLOCK IN</p>
              </button>
              <button onClick={handleClockOut} disabled={!isClockedIn || processing}
                className={`rounded-3xl p-6 text-center transition-all ${!isClockedIn ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg active:scale-95'}`}>
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2" />
                <p className="font-bold text-lg">CLOCK OUT</p>
              </button>
            </div>

            <div className={`rounded-3xl p-6 text-center mb-6 shadow-sm ${isClockedIn ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-slate-100 border-2 border-slate-200'}`}>
              <p className="text-lg font-bold">{isClockedIn ? '🟢 WORKING' : '⚪ NOT CLOCKED IN'}</p>
              {clockInTime && <p className="text-sm text-slate-600 mt-2">In: <span className="font-mono font-bold">{fmtTimeStr(clockInTime)}</span></p>}
              {clockOutTime && <p className="text-sm text-slate-600 mt-1">Out: <span className="font-mono font-bold">{fmtTimeStr(clockOutTime)}</span></p>}
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><History className="w-4 h-4" />Recent History</h3>
              {history.map((r, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500">{fmtDateStr(r.attendance_date)}</span>
                  <span className="text-emerald-600">{fmtTimeStr(r.clock_in_time)}</span>
                  <span className="text-slate-400">→</span>
                  <span className={r.clock_out_time ? 'text-red-600' : 'text-amber-600'}>{r.clock_out_time ? fmtTimeStr(r.clock_out_time) : 'Active'}</span>
                  {r.total_hours && <span className="text-slate-400 ml-2">{r.total_hours.toFixed(1)}h</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav active="clock" />
    </div>
  )
}
