import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { Bell, CheckCheck, Tag, Clock } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  return (
    <div>
      <PageHeader
        title="Notification Center"
        subtitle="In-app real-time notification alerts, complaint lifecycle updates, and attendance alerts."
        action={
          unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={markAllAsRead}>
              <CheckCheck size={16} /> Mark All as Read
            </button>
          )
        }
      />

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <Bell size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>You have no notifications at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: n.read ? '#ffffff' : '#f8fafc',
                  border: '1px solid',
                  borderColor: n.read ? '#e2e8f0' : '#c7d2fe',
                  borderLeft: n.read ? '1px solid #e2e8f0' : '4px solid #4f46e5',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{n.title}</strong>
                    {!n.read && (
                      <span style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>{n.message}</p>
                </div>

                <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
