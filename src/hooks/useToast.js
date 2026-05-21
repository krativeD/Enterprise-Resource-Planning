import { useState, useCallback } from 'react'

let toastId = 0

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }

    const newToast = {
      id,
      message,
      type,
      icon: icons[type] || icons.info,
      exiting: false
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
      
      // Remove after exit animation
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 300)
    }, duration)

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 300)
  }, [])

  const ToastContainer = () => {
    if (toasts.length === 0) return null
    
    return (
      <div className="toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}
          >
            <span className="toast-icon">{toast.icon}</span>
            <span className="toast-message">{toast.message}</span>
            <span 
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    )
  }

  return { 
    toasts, 
    showToast, 
    removeToast,
    ToastContainer 
  }
}
