import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../../../store/authStore'
import useMobileStore from '../store/mobileStore'
import BottomNav from '../components/BottomNav'
import toast from 'react-hot-toast'
import { supabase } from '../../../lib/supabaseClient'
import { Camera, Upload, ArrowLeft, CheckCircle2, Image, Briefcase } from 'lucide-react'

export default function PhotoUpload() {
  const { user, profile } = useAuthStore()
  const { myJobs, fetchMyJobs } = useMobileStore()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  
  const [selectedJob, setSelectedJob] = useState('')
  const [photoType, setPhotoType] = useState('before')
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [myCleanerName, setMyCleanerName] = useState('')
  const [myActiveJob, setMyActiveJob] = useState(null)

  useEffect(() => {
    setupAndLoad()
  }, [])

  const setupAndLoad = async () => {
    // Find cleaner name
    try {
      let { data: emp } = await supabase.from('employees').select('id, first_name, last_name').eq('user_id', user?.id).single()
      if (emp) {
        setMyCleanerName((emp.first_name + ' ' + (emp.last_name || '')).trim())
      } else {
        const { data: empByEmail } = await supabase.from('employees').select('id, first_name, last_name').eq('email', user?.email).single()
        if (empByEmail) {
          setMyCleanerName((empByEmail.first_name + ' ' + (empByEmail.last_name || '')).trim())
        } else {
          setMyCleanerName(profile?.full_name || user?.email?.split('@')[0] || 'Cleaner')
        }
      }
    } catch (e) {}

    // Load active jobs for this cleaner
    await loadMyActiveJob()
  }

  const isMyJob = (job) => {
    if (!job?.notes || !myCleanerName) return false
    const notes = job.notes.toLowerCase()
    const myName = myCleanerName.toLowerCase()
    if (notes.includes('selected by: ' + myName)) return true
    if (notes.includes('assigned by management: ' + myName)) return true
    return false
  }

  const loadMyActiveJob = async () => {
    const { data: allActive } = await supabase
      .from('jobs')
      .select('id, title, job_number, status, notes, clients(company_name)')
      .eq('status', 'in_progress')
      .order('scheduled_date', { ascending: true })

    const myJobsOnly = (allActive || []).filter(job => isMyJob(job))
    
    if (myJobsOnly.length > 0) {
      setMyActiveJob(myJobsOnly[0])
      setSelectedJob(myJobsOnly[0].id)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedJob) { toast.error('No active job selected'); return }
    if (!selectedFile) { toast.error('Please select a photo'); return }

    setUploading(true)
    
    try {
      // Upload to storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = 'job-photos/' + selectedJob + '/' + Date.now() + '.' + fileExt
      
      const { error: uploadError } = await supabase.storage
        .from('fleet')
        .upload(fileName, selectedFile, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('fleet').getPublicUrl(fileName)

      // Save to job_photos table
      const { error: dbError } = await supabase
        .from('job_photos')
        .insert([{
          job_id: selectedJob,
          photo_type: photoType,
          photo_url: publicUrl,
          caption: caption,
          taken_at: new Date().toISOString()
        }])

      if (dbError) throw dbError

      toast.success('Photo uploaded! 📸')
      setUploadedPhotos([...uploadedPhotos, { url: preview, type: photoType, caption }])
      setPreview(null)
      setSelectedFile(null)
      setCaption('')
      
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-20">
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 px-4 pt-8 pb-6 text-white">
        <button onClick={() => navigate('/mobile')} className="p-1 rounded-lg hover:bg-white/20 mb-4">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Upload Photos</h1>
        <p className="text-blue-100 text-sm">Before & after job photos</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Active Job Banner */}
        {myActiveJob ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-l-amber-400">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">{myActiveJob.title}</p>
                <p className="text-xs text-slate-500">{myActiveJob.job_number} · {myActiveJob.clients?.company_name || 'Client'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Photos will be linked to this job automatically</p>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <p className="text-amber-700 text-sm">⚠️ No active job found. Select a job first from the Jobs page.</p>
            <button onClick={() => navigate('/mobile/jobs')} className="mt-2 text-amber-600 text-sm font-medium underline">
              Go to Jobs
            </button>
          </div>
        )}

        {/* Photo Type */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-semibold text-slate-500 mb-2 block">Photo Type</label>
          <div className="flex gap-2">
            {['before', 'after', 'incident', 'other'].map(type => (
              <button key={type} onClick={() => setPhotoType(type)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  photoType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Preview */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
              <button onClick={() => { setPreview(null); setSelectedFile(null) }} 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">✕</button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center gap-3">
              <Image className="w-12 h-12 text-slate-300" />
              <p className="text-slate-400 text-sm">No photo selected</p>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <input type="text" value={caption} onChange={e => setCaption(e.target.value)} 
            placeholder="Add a caption..." className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm" />
        </div>

        {/* Action Buttons */}
        {myActiveJob && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={openCamera} className="bg-blue-500 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-blue-600 active:scale-95 transition-all">
                <Camera className="w-8 h-8" />
                <span className="font-semibold">Take Photo</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="bg-emerald-500 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all">
                <Upload className="w-8 h-8" />
                <span className="font-semibold">Choose File</span>
              </button>
            </div>

            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

            {selectedFile && (
              <button onClick={handleUpload} disabled={uploading}
                className="w-full bg-emerald-500 text-white rounded-2xl p-4 font-bold text-lg hover:bg-emerald-600 disabled:opacity-50 active:scale-95 transition-all">
                {uploading ? 'Uploading...' : '📤 Upload Photo'}
              </button>
            )}
          </>
        )}

        {/* Uploaded Photos */}
        {uploadedPhotos.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-3">Uploaded ({uploadedPhotos.length})</h3>
            <div className="grid grid-cols-3 gap-2">
              {uploadedPhotos.map((p, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden">
                  <img src={p.url} alt={p.type} className="w-full h-24 object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full capitalize">{p.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav active="photos" />
    </div>
  )
}
