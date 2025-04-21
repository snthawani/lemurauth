'use client'

import { useState } from 'react'
import '../../styles/styles.css'

export default function ClientHome({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [method, setMethod] = useState<'email' | 'phone' | ''>('')
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Sending...')

    const res = await fetch('/api/request-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, value: input }),
    })

    const data = await res.json()
    setStatus(data.message || data.error || 'Something went wrong')
  }

  const handleLogout = async () => {
    const res = await fetch('/api/logout', { method: 'GET' })
    if (res.ok) {
      window.location.reload()
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Passwordless Login</h1>

        {isAuthenticated ? (
          <>
            <p>You are logged in!</p>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : method === '' ? (
          <>
            <p>How would you like to log in?</p>
            <button onClick={() => setMethod('email')}>Login with Email</button>
            <button onClick={() => setMethod('phone')}>Login with Phone</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>Enter your {method === 'email' ? 'email address' : 'phone number'}:</p>
            <input
              placeholder={method === 'email' ? 'example@email.com' : '+1234567890'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <button type="submit">Send Link</button>
              <button
                type="button"
                onClick={() => {
                  setMethod('')
                  setInput('')
                  setStatus('')
                }}
                className="go-back"
              >
                Go Back
              </button>
            </div>
          </form>
        )}

        {status && <p className="status">{status}</p>}
      </div>
    </main>
  )
}
