import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toString().toLowerCase().replace(/ /g, '_');
  const formatted = status.toString().replace(/_/g, ' ');

  return (
    <span className={`badge badge-${normalized}`}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}></span>
      {formatted}
    </span>
  );
};
