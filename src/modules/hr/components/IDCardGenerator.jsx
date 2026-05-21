import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { MdClose, MdPrint, MdDownload } from 'react-icons/md'
import html2canvas from 'html2canvas'

const IDCardGenerator = ({ employee, onClose }) => {
  const cardRef = useRef(null)

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2 })
      const link = document.createElement('a')
      link.download = `ID_Card_${employee?.first_name}_${employee?.last_name}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }

  const handlePrint = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2 })
      const win = window.open()
      win.document.write(`<img src="${canvas.toDataURL()}"/>`)
      win.document.close()
      win.focus()
      setTimeout(() => win.print(), 500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="em-modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="em-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '450px' }}
      >
        <div className="em-modal-header">
          <h2>🪪 Employee ID Card</h2>
          <button onClick={onClose} className="em-modal-close">
            <MdClose />
          </button>
        </div>
        <div className="em-modal-body">
          {/* ID Card */}
          <div
            ref={cardRef}
            style={{
              background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white',
              marginBottom: '20px'
            }}
          >
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              color: '#1a1a1a'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '80px',
                  height: '100px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '3px solid #1e3a8a',
                  flexShrink: 0,
                  background: '#e5e7eb'
                }}>
                  <img
                    src={employee?.image_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                    alt="Employee"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '4px' }}>
                    {employee?.first_name} {employee?.last_name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600', marginBottom: '8px' }}>
                    {employee?.position || 'Employee'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                    ID: {employee?.employee_id || 'N/A'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                    Dept: {employee?.department || 'N/A'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Phone: {employee?.cell_phone || 'N/A'}
                  </p>
                </div>
              </div>
              <div style={{
                borderTop: '2px solid #e5e7eb',
                paddingTop: '12px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '10px', color: '#1e3a8a', fontWeight: '600', marginBottom: '2px' }}>
                  NDANDULENI CLEANING SERVICES
                </p>
                <p style={{ fontSize: '9px', color: '#999' }}>
                  This card is property of Ndanduleni Cleaning. If found, please return to HR.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="em-neo-btn"
              onClick={handleDownload}
              style={{ flex: 1, height: '40px' }}
            >
              <MdDownload style={{ display: 'inline', marginRight: '5px' }} /> Download
            </button>
            <button
              className="em-neo-btn em-neo-btn-green"
              onClick={handlePrint}
              style={{ flex: 1, height: '40px' }}
            >
              <MdPrint style={{ display: 'inline', marginRight: '5px' }} /> Print
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default IDCardGenerator
