import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { addContact } from '../store/contact'

export default function Contacts() {
  const dispatch = useDispatch()
  const contacts = useSelector((state) => state.contacts?.contacts || [])
  const userId = useSelector((state) => state.user.userId)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!userId) return;
    const fetchContacts = async () => {
      const response = await fetch(`http://localhost:3000/api/contacts?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      dispatch(addContact(data))
    }
    fetchContacts()
  }, [userId, dispatch])

  const parsePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return { prefix: '', number: '' };
    
    // Match phone numbers starting with + followed by digits
    const match = phoneNumber.match(/^(\+\d{1,2})(.+)$/);
    if (match) {
      return {
        prefix: match[1], // Country code with +
        number: match[2]   // Rest of the number
      };
    }
    
    // If no prefix found, return the whole number as the number part
    return {
      prefix: '',
      number: phoneNumber
    };
  }

  const copyToClipboard = async (numberOnly, index) => {
    if (!numberOnly) return;
    try {
      await navigator.clipboard.writeText(numberOnly)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    const contactName = (contact.name || contact.contactName || '').toLowerCase();
    return contactName.includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 
          style={{ 
            margin: 0, 
            fontSize: '2rem', 
            fontWeight: 800, 
            letterSpacing: '0.015em', 
            color: '#2264ad', 
            textShadow: '0 1.5px 7px #e9f2fc, 0 1px 2px #b4dbfe42', 
            lineHeight: '1.2'
          }}
        >
          Contacts
        </h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 15px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '300px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>
      {filteredContacts && filteredContacts.length > 0 ? (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginTop: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ 
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #ddd'
            }}>
              <th style={{ 
                padding: '12px',
                textAlign: 'left',
                borderBottom: '2px solid #ddd'
              }}>Name</th>
              <th style={{ 
                padding: '12px',
                textAlign: 'left',
                borderBottom: '2px solid #ddd'
              }}>Mobile Number</th>
              <th style={{ 
                padding: '12px',
                textAlign: 'center',
                borderBottom: '2px solid #ddd'
              }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact, index) => {
              const uniqueKey = contact.id 
                ? `${contact.id}-${index}` 
                : `contact-${index}-${contact.name || 'Unknown'}-${contact.phone || contact.email || ''}`;
              const phoneNumber = contact.phone || contact.mobileNumber || '';
              const contactName = contact.name || contact.contactName || 'Unnamed Contact';
              const { prefix, number } = parsePhoneNumber(phoneNumber);
              
              return (
                <tr 
                  key={uniqueKey}
                  style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                  }}
                >
                  <td style={{ padding: '12px' }}>{contactName}</td>
                  <td style={{ padding: '12px' }}>
                    {phoneNumber ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {prefix && (
                          <span style={{ 
                            fontWeight: 'bold', 
                            color: '#666',
                            userSelect: 'none',
                            fontSize: '14px'
                          }}>
                            {prefix}
                          </span>
                        )}
                        <span style={{ fontSize: '14px' }}>{number || 'N/A'}</span>
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {phoneNumber && number && (
                      <button
                        onClick={() => copyToClipboard(number, index)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: copiedIndex === index ? '#4CAF50' : '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => {
                          if (copiedIndex !== index) {
                            e.target.style.backgroundColor = '#0056b3'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (copiedIndex !== index) {
                            e.target.style.backgroundColor = '#007bff'
                          }
                        }}
                      >
                        {copiedIndex === index ? '✓ Copied' : 'Copy'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: '20px', color: '#666' }}>
          {searchQuery ? `No contacts found matching "${searchQuery}"` : 'No contacts found'}
        </p>
      )}
    </div>
  )
}
