'use client';

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import '../../../../styles/styles.css';

export default function VerifyPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const id = urlParams.get('id');
    const token = urlParams.get('token');
    if (!id || !token) {
      setError('ID and token are required in the URL.');
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await fetch(`/api/verify?id=${id}&token=${token}`);

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setError('');
        } else {
          setError(data.error);
          setMessage('');
        }
      } catch (err) {
        console.log(err)
        console.log(error)
        console.log(message)
        setError('An error occurred while verifying the user.');
        setMessage('');
      }

      router.push('/')
    };

    verifyUser();
  }, []);

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h1 className="verify-title">Verify User</h1>
        
        <p className="redirect-message">Redirecting to app</p>
      </div>
    </div>
  );
}
