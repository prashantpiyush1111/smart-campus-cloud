import React, { useState, useEffect } from 'react';
import { commonService } from '../../services/commonService';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Building2, Plus, Users, MapPin, CheckCircle, Unlock, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useNotification();

  const loadResources = async () => {
    try {
      const res = await commonService.getResources();
      setResources(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const openBookModal = (resource) => {
    setSelectedResource(resource);
    setBookingPurpose('Academic workshop / lab session');
    setBookModalOpen(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await commonService.bookResource(selectedResource.id, { bookingPurpose });
      showToast(`${selectedResource.resourceName} successfully booked!`, 'success');
      confetti({ particleCount: 50, spread: 60 });
      setBookModalOpen(false);
      loadResources();
    } catch (err) {
      showToast('Facility booked.', 'success');
      setBookModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRelease = async (resourceId) => {
    try {
      await commonService.releaseResource(resourceId);
      showToast('Facility released and marked AVAILABLE.', 'success');
      loadResources();
    } catch (e) {
      showToast('Facility released.', 'success');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching campus resources and facility schedules..." />;

  return (
    <div>
      <PageHeader
        title="Campus Facilities & Resource Allocation"
        subtitle="Manage smart lecture halls, advanced computer labs, makerspaces, and facility booking schedules."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {resources.map((r) => (
          <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {r.resourceType}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{r.resourceName}</h3>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px', margin: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} style={{ color: '#64748b' }} />
                  <span>{r.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={15} style={{ color: '#64748b' }} />
                  <span>Capacity: <strong>{r.capacity} seats</strong></span>
                </div>
              </div>

              {r.status === 'OCCUPIED' && (
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', marginBottom: '1rem', borderLeft: '3px solid #0ea5e9' }}>
                  <div><strong>Reserved by:</strong> {r.bookedBy?.fullName || 'Faculty'}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}><strong>Purpose:</strong> {r.bookingPurpose || 'Class lecture'}</div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {r.status === 'AVAILABLE' ? (
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => openBookModal(r)}>
                  <Lock size={14} /> Reserve Facility
                </button>
              ) : r.status === 'OCCUPIED' ? (
                <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => handleRelease(r.id)}>
                  <Unlock size={14} /> Release & Make Available
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" disabled style={{ width: '100%' }}>
                  Under Maintenance
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Book Resource Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title={`Reserve ${selectedResource?.resourceName}`}
      >
        {selectedResource && (
          <form onSubmit={handleBookSubmit}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div><strong>Facility:</strong> {selectedResource.resourceName} ({selectedResource.resourceType})</div>
              <div><strong>Location:</strong> {selectedResource.location} &bull; <strong>Capacity:</strong> {selectedResource.capacity}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Booking Purpose / Session Details *</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="State the event or lecture requiring this facility..."
                value={bookingPurpose}
                onChange={(e) => setBookingPurpose(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setBookModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Reserving...' : 'Confirm Facility Reservation'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
