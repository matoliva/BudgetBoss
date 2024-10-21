'use client';

// import signOut
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h1>Sign in to your account</h1>
      <button
        onClick={() => signIn('google')}
        style={{
          backgroundColor: '#4285F4',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Sign in with Google
      </button>
    </div>
    //Sign-out button
//     <button
//     onClick={() => signOut()}
//     style={{
//       backgroundColor: '#d9534f',
//       color: 'white',
//       padding: '10px 20px',
//       border: 'none',
//       borderRadius: '5px',
//       cursor: 'pointer',
//       fontSize: '16px',
//     }}
//   >
//     Sign out
//   </button>
  );
}
