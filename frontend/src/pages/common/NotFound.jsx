import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div className="logo-badge" style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem' }}>
        <Cloud size={32} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a' }}>404</h1>
      <h2 style={{ fontSize: '1.4rem', color: '#334155', marginTop: '0.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#64748b', maxWidth: '400px', marginBottom: '2rem', fontSize: '0.95rem' }}>
        The campus cloud resource you are trying to access does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
};
