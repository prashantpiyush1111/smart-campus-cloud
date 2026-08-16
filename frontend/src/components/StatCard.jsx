import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo' }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-lbl">{title}</div>
        {subtitle && <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  );
};
