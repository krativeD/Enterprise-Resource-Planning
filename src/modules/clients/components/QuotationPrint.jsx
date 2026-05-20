import React from 'react'

const QuotationPrint = React.forwardRef(({ quotation }, ref) => {
  const {
    quote_number, date, valid_until,
    company_name, company_address, company_phone, company_email, company_logo,
    client_name, client_address, client_city, client_state, client_zip,
    client_contact, client_email, client_phone,
    items, subtotal, discount, discountAmount, tax_rate, taxAmount, total,
    notes, terms
  } = quotation

  return (
    <div ref={ref} style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      {/* Header with Logo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '3px solid #1e3a8a',
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        <div>
          <img 
            src={company_logo || '/logo.png'} 
            alt="Company Logo" 
            style={{ 
              width: '180px', 
              height: 'auto',
              marginBottom: '10px'
            }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <div style={{ display: 'none', fontSize: '28px', fontWeight: 'bold', color: '#1e3a8a' }}>
            {company_name}
          </div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1e3a8a',
            marginBottom: '5px'
          }}>
            {company_name}
          </h1>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>{company_address}</p>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Tel: {company_phone}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>Email: {company_email}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            backgroundColor: '#1e3a8a',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '8px',
            display: 'inline-block'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>QUOTATION</h2>
          </div>
          <div style={{ marginTop: '15px' }}>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong>Quote #:</strong> {quote_number}
            </p>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong>Date:</strong> {date}
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Valid Until:</strong> {valid_until}
            </p>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
      }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>
            BILL TO:
          </h3>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '3px' }}>{client_name}</p>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>{client_address}</p>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>
            {client_city}, {client_state} {client_zip}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '13px', marginBottom: '3px' }}>
            <strong>Contact:</strong> {client_contact}
          </p>
          <p style={{ fontSize: '13px', marginBottom: '3px' }}>
            <strong>Email:</strong> {client_email}
          </p>
          <p style={{ fontSize: '13px' }}>
            <strong>Phone:</strong> {client_phone}
          </p>
        </div>
      </div>

      {/* Services Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>Service</th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>Description</th>
            <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>Frequency</th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>Rate/h</th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>Hours</th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => (
            <tr key={index} style={{ 
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
            }}>
              <td style={{ padding: '12px', fontSize: '13px', fontWeight: '500' }}>{item.service}</td>
              <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{item.description}</td>
              <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>
                  {item.frequency}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>
                ${(item.rate || 0).toFixed(2)}
              </td>
              <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>
                {item.hours || 0}h
              </td>
              <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '500' }}>
                ${(item.amount || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <div style={{ width: '250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}>
            <span>Subtotal:</span>
            <span>${(subtotal || 0).toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', color: '#dc2626' }}>
              <span>Discount ({discount}%):</span>
              <span>-${(discountAmount || 0).toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}>
            <span>Tax ({tax_rate}%):</span>
            <span>${(taxAmount || 0).toFixed(2)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '12px 0', 
            borderTop: '2px solid #1e3a8a',
            marginTop: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            <span>TOTAL:</span>
            <span style={{ color: '#1e3a8a', fontSize: '20px' }}>
              ${(total || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
        {notes && (
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>
              NOTES:
            </h4>
            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>{notes}</p>
          </div>
        )}
        {terms && (
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>
              TERMS & CONDITIONS:
            </h4>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {terms}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '2px solid #e5e7eb',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#999'
      }}>
        <p style={{ marginBottom: '5px' }}>
          Thank you for choosing {company_name}
        </p>
        <p>
          This is a computer-generated document. No signature required.
        </p>
      </div>
    </div>
  )
})

QuotationPrint.displayName = 'QuotationPrint'

export default QuotationPrint
