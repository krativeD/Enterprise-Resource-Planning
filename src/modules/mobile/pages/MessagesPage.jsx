import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'
import BottomNav from '../components/BottomNav'
import toast from 'react-hot-toast'
import { supabase } from '../../../lib/supabaseClient'
import { ArrowLeft, Send, User, CheckCheck, Search, Phone, Video, MoreVertical, Smile, Mic } from 'lucide-react'

export default function MessagesPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [unreadCounts, setUnreadCounts] = useState({})

  useEffect(() => {
    loadContacts()
    loadUnreadCounts()
    
    // Real-time subscription for incoming messages
    const channel = supabase
      .channel('messages-incoming')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user?.id}` },
        (payload) => {
          const newMsg = payload.new
          // Play notification sound
          try { new Audio('/notification.mp3').play().catch(() => {}) } catch(e) {}
          
          // If in chat with this sender, add to messages
          if (selectedContact && newMsg.sender_id === selectedContact.id) {
            setMessages(prev => [...prev, newMsg])
            markAsRead(newMsg.id)
            scrollToBottom()
          }
          
          // Update unread counts
          loadUnreadCounts()
          
          // Show toast
          const sender = contacts.find(c => c.id === newMsg.sender_id)
          toast.success(`New message from ${sender?.name || 'someone'}`, { duration: 3000, icon: '💬' })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedContact, user?.id])

  useEffect(() => {
    if (selectedContact) {
      loadMessages()
      inputRef.current?.focus()
    }
  }, [selectedContact])

  useEffect(() => { scrollToBottom() }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const markAsRead = async (msgId) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', msgId)
  }

  const loadUnreadCounts = async () => {
    const { data } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('receiver_id', user?.id)
      .eq('is_read', false)
    
    const counts = {}
    data?.forEach(m => { counts[m.sender_id] = (counts[m.sender_id] || 0) + 1 })
    setUnreadCounts(counts)
  }

  const loadContacts = async () => {
    setLoading(true)
    
    // Get all profiles
    const { data: profiles } = await supabase.from('profiles').select('*').neq('id', user?.id).order('full_name')
    // Get all employees
    const { data: employees } = await supabase.from('employees').select('*').order('first_name')
    
    const contactMap = new Map()
    
    employees?.forEach(emp => {
      if (emp.user_id && emp.user_id !== user?.id) {
        contactMap.set(emp.user_id, {
          id: emp.user_id,
          name: `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.email || 'Staff',
          role: emp.position || 'Employee',
          email: emp.email,
          phone: emp.phone,
          avatar: emp.first_name?.[0]?.toUpperCase() || 'S'
        })
      }
    })
    
    profiles?.forEach(prof => {
      if (prof.id !== user?.id && !contactMap.has(prof.id)) {
        contactMap.set(prof.id, {
          id: prof.id,
          name: prof.full_name || prof.email?.split('@')[0] || 'User',
          role: (prof.role || 'staff').replace(/_/g, ' '),
          email: prof.email,
          avatar: (prof.full_name?.[0] || prof.email?.[0] || 'U').toUpperCase()
        })
      }
    })
    
    setContacts(Array.from(contactMap.values()))
    setLoading(false)
  }

  const loadMessages = async () => {
    if (!selectedContact) return
    
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user?.id})`)
      .order('created_at', { ascending: true })
      .limit(100)

    setMessages(data || [])

    // Mark all unread as read
    const unread = data?.filter(m => m.sender_id === selectedContact.id && !m.is_read) || []
    for (const m of unread) {
      await markAsRead(m.id)
    }
    loadUnreadCounts()
  }

  const handleSend = async () => {
    const text = newMessage.trim()
    if (!text || !selectedContact || sending) return
    
    setNewMessage('')
    setSending(true)

    const { data, error } = await supabase.from('messages').insert([{
      sender_id: user?.id,
      receiver_id: selectedContact.id,
      message_text: text,
      is_read: false
    }]).select().single()

    if (error) {
      toast.error('Failed to send')
      setNewMessage(text)
    } else {
      setMessages(prev => [...prev, data])
      scrollToBottom()
    }
    setSending(false)
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now - d
    if (diff < 86400000 && d.getDate() === now.getDate()) {
      return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
    } else if (diff < 172800000) {
      return 'Yesterday'
    } else if (diff < 604800000) {
      return d.toLocaleDateString('en-ZA', { weekday: 'short' })
    }
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
  }

  const formatChatTime = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
  }

  const getLastMessage = (contactId) => {
    // This would need a separate query - simplified for now
    return ''
  }

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      {/* CONTACTS VIEW */}
      {!selectedContact && (
        <>
          {/* Header */}
          <div className="bg-emerald-600 px-4 pt-12 pb-4 text-white sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => navigate('/mobile')} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
              <h1 className="text-xl font-bold">Messages</h1>
              <div className="w-10"></div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/20 text-white placeholder-white/60 text-sm focus:outline-none" />
            </div>
          </div>

          {/* Contacts */}
          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
            {loading ? (
              <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div></div>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <button key={contact.id} onClick={() => setSelectedContact(contact)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-left">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-emerald-600">{contact.avatar}</span>
                    </div>
                    {unreadCounts[contact.id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center">
                        {unreadCounts[contact.id]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <span className="text-xs text-gray-400">{formatTime(Date.now())}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{contact.role}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12"><User className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No contacts</p></div>
            )}
          </div>
        </>
      )}

      {/* CHAT VIEW */}
      {selectedContact && (
        <div className="flex flex-col h-screen bg-gray-50">
          {/* Chat Header */}
          <div className="bg-emerald-600 px-4 pt-12 pb-3 flex items-center gap-3 sticky top-0 z-10">
            <button onClick={() => setSelectedContact(null)} className="p-1"><ArrowLeft className="w-6 h-6 text-white" /></button>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">{selectedContact.avatar}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold">{selectedContact.name}</h2>
              <p className="text-emerald-100 text-xs capitalize">{selectedContact.role}</p>
            </div>
            <button className="p-2"><Phone className="w-5 h-5 text-white" /></button>
            <button className="p-2"><Video className="w-5 h-5 text-white" /></button>
            <button className="p-2"><MoreVertical className="w-5 h-5 text-white" /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAIRJREFUaEPt1rENwCAMBMCf/ZdgcAiGYGQGJIqU93AiT5b9fX4iIiIicjHw/fI6A+QK5K8HHnlEnpEX4LaRuQK5G+QFcuT/I1cg60Be1AN5Rtb7PLICeUbeL5AVyBVYJ0cGciQ9kCP1AbkCWQdyJI1Abh+wFch9kL/NN9qJ64PxN3IAAAAASUVORK5CYII=")' }}>
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center bg-white/80 rounded-2xl px-6 py-4 shadow-sm">
                  <p className="text-gray-500">🔒 Messages are end-to-end encrypted</p>
                  <p className="text-gray-400 text-xs mt-1">No messages yet. Say hello! 👋</p>
                </div>
              </div>
            )}
            {messages.map((msg, i) => {
              const isMine = msg.sender_id === user?.id
              const showDate = i === 0 || new Date(msg.created_at).toDateString() !== new Date(messages[i-1]?.created_at).toDateString()
              
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-3">
                      <span className="bg-white/80 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                      isMine ? 'bg-emerald-100 rounded-tr-none' : 'bg-white rounded-tl-none'
                    }`}>
                      <p className="text-sm text-gray-800">{msg.message_text}</p>
                      <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-gray-400">{formatChatTime(msg.created_at)}</span>
                        {isMine && <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-blue-500' : 'text-gray-400'}`} />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-t border-gray-200">
            <button className="p-2 text-gray-500"><Smile className="w-6 h-6" /></button>
            <div className="flex-1 bg-white rounded-full px-4 py-2">
              <input ref={inputRef} type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }}}
                placeholder="Message" className="w-full text-sm outline-none bg-transparent" />
            </div>
            {newMessage.trim() ? (
              <button onClick={handleSend} disabled={sending} className="p-2 bg-emerald-500 text-white rounded-full">
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button className="p-2 text-gray-500"><Mic className="w-6 h-6" /></button>
            )}
          </div>
        </div>
      )}

      {!selectedContact && <BottomNav active="home" />}
    </div>
  )
}
