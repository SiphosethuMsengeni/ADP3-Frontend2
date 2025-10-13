import React, { useState } from 'react';
import './AboutContact.css';
import { contactService, handleAPIError } from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', message: 'Please fill all fields.' });
      return;
    }
    setLoading(true);
    try {
      // call backend contact create
      await contactService.create(form);
      setStatus({ type: 'success', message: 'Thanks — we received your message!' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      const msg = handleAPIError(err);
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page container">
      <section className="hero-small">
        <h1>Contact Us</h1>
        <p className="lead">Questions, feedback or book requests — we'd love to hear from you.</p>
      </section>

      <section className="contact-grid">
        <div className="card contact-card">
          <h3>Get in touch</h3>
          <p>Drop us a message and we'll get back within 1-2 business days.</p>

          {status && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`} role="status">
              {status.message}
            </div>
          )}

          <form onSubmit={onSubmit} className="contact-form" aria-label="Contact form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={onChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange} />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" value={form.message} onChange={onChange} />
            </div>

            <button type="submit" className="btn" disabled={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
          </form>
        </div>

        <aside className="card info-card">
          <h4>Other ways to reach us</h4>
          <p><strong>Phone:</strong> +27 21 460 3911</p>
          <p><strong>Email:</strong> info@snuggleread.ac.za</p>
          <p><strong>Address:</strong> University Campus Bookstore, Main Campus Road</p>
        </aside>
      </section>
    </main>
  );
};

export default Contact;
