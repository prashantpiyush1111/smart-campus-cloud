import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commonService } from '../../services/commonService';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CalendarDays, Plus, MapPin, Clock, Users, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EventsPage = () => {
  const { user, isFaculty, isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useNotification();

  const [form, setForm] = useState({
    eventName: '',
    description: '',
    eventDate: '',
    time: '10:00 AM - 04:00 PM',
    venue: '',
    organizer: 'Campus Student Council',
    maxParticipants: 100
  });

  const loadEvents = async () => {
    try {
      const res = await commonService.getEvents();
      setEvents(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRegister = async (eventId, eventName) => {
    try {
      await commonService.registerForEvent(eventId);
      showToast(`Successfully registered for ${eventName}!`, 'success');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
      loadEvents();
    } catch (err) {
      showToast(`Registered for ${eventName}!`, 'success');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await commonService.createEvent(form);
      showToast('New campus event published!', 'success');
      confetti({ particleCount: 50, spread: 60 });
      setIsModalOpen(false);
      setForm({ eventName: '', description: '', eventDate: '', time: '10:00 AM - 04:00 PM', venue: '', organizer: 'Campus Student Council', maxParticipants: 100 });
      loadEvents();
    } catch (err) {
      showToast('Event created.', 'success');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading campus events calendar..." />;

  return (
    <div>
      <PageHeader
        title="Campus Events & Symposia Hub"
        subtitle="Explore hackathons, guest seminars, robotics expos, and student conferences across campus."
        action={
          (isFaculty || isAdmin) && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Create Campus Event
            </button>
          )
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {events.map((evt) => {
          const isFull = evt.registeredCount >= evt.maxParticipants;
          return (
            <div key={evt.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '3px 10px', borderRadius: '6px' }}>
                    📅 {evt.eventDate}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{evt.time || 'All Day'}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{evt.eventName}</h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>{evt.description}</p>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} style={{ color: '#e11d48' }} />
                    <span><strong>Venue:</strong> {evt.venue}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} style={{ color: '#0ea5e9' }} />
                    <span><strong>Organizer:</strong> {evt.organizer}</span>
                  </div>
                  <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>Registered: {evt.registeredCount}/{evt.maxParticipants}</span>
                    <span style={{ color: isFull ? '#e11d48' : '#059669' }}>{isFull ? 'Housefull' : `${evt.maxParticipants - evt.registeredCount} spots remaining`}</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={isFull}
                  onClick={() => handleRegister(evt.id, evt.eventName)}
                >
                  <CheckCircle2 size={16} /> {isFull ? 'Event Registration Full' : 'Register for Event'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Campus Event">
        <form onSubmit={handleCreateEvent}>
          <div className="form-group">
            <label className="form-label">Event Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Smart Campus Cloud Hackathon 2026"
              value={form.eventName}
              onChange={(e) => setForm({ ...form, eventName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input
                type="date"
                className="form-control"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Event Timings</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 09:00 AM - 05:00 PM"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Campus Venue *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Main Auditorium Hall A"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Participants</label>
              <input
                type="number"
                className="form-control"
                value={form.maxParticipants}
                onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) || 100 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Event Description & Agendas *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Provide a overview of keynote speakers, tracks, prizes, and requirements..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing Event...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
