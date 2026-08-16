import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#6366f1' }}>
      <Loader2 size={36} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{text}</p>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
