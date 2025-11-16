import React, { useEffect, useState } from 'react'

export default function GlobalBanner() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pesdo_welcome_banner')
      if (raw) {
        const { text } = JSON.parse(raw)
        if (text) {
          setMessage(text)
          setVisible(true)
        }
      }
    } catch {}
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.removeItem('pesdo_welcome_banner')
    } catch {}
  }

  if (!visible || !message) return null

  return (
    <div style={{background:'#ecfdf5', border:'1px solid #86efac', color:'#065f46', padding:'12px 16px', textAlign:'center'}}>
      <span style={{fontWeight:600}}>{message}</span>
      <button onClick={dismiss} style={{marginLeft:12, background:'transparent', border:'none', color:'#065f46', cursor:'pointer', fontWeight:600}}>Dismiss</button>
    </div>
  )
}


