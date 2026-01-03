import React from 'react'

export default function GoogleAuthButton() {
    const handleGoogleAuth = async () => {
        window.location.href = "http://localhost:3000/auth/google";
    };
    return (
        <button
            onClick={handleGoogleAuth}
            style={{
                padding: '10px 24px',
                // background: 'linear-gradient(93deg  , #4285F4, #34A853 48%, #FBBC05 76%, #EA4335)',
                color: 'gray',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                letterSpacing: '.02em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 2px 12px rgba(66,133,244,0.10)',
                transition: 'background 0.2s, transform 0.13s',
            }}
            onMouseOver={e => (e.target.style.transform = "scale(1.035)")}
            onMouseOut={e => (e.target.style.transform = "scale(1)")}
        >
            <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="Google Icon" style={{ width: '21px', height: '21px' }} />
            <span>Link Contacts with Google</span>
        </button>
    );
}
