'use client';

import { useMemo, useState, useTransition } from 'react';
import { I18N, LINKEDIN_URL } from '@/lib/i18n';
import { t } from '@/lib/lang';
import { submitContact } from '@/app/actions/contact';
import './contact.css';

export default function ContactForm({ lang }) {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorKey, setErrorKey] = useState(null);
  const [pending, startTransition] = useTransition();
  const loadedAt = useMemo(() => Date.now(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('loadedAt', String(loadedAt));
    formData.set('lang', lang);
    setStatus('sending');
    setErrorKey(null);
    startTransition(async () => {
      try {
        const result = await submitContact(null, formData);
        if (result?.ok) {
          setStatus('sent');
          form.reset();
        } else {
          setStatus('error');
          setErrorKey(result?.error || 'invalid');
        }
      } catch {
        setStatus('error');
        setErrorKey('send_failed');
      }
    });
  };

  const feedbackKey = status === 'sent' ? 'sent' : errorKey;

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from real users, bots fill it. */}
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="cf-field">
        <label htmlFor="cf-name">{t(I18N.contact.fields.name, lang)}</label>
        <input
          id="cf-name"
          type="text"
          name="name"
          required
          maxLength={120}
          placeholder={t(I18N.contact.placeholder.name, lang)}
        />
      </div>

      <div className="cf-field">
        <label htmlFor="cf-email">{t(I18N.contact.fields.email, lang)}</label>
        <input
          id="cf-email"
          type="email"
          name="email"
          required
          maxLength={200}
          placeholder={t(I18N.contact.placeholder.email, lang)}
        />
      </div>

      <div className="cf-field">
        <label htmlFor="cf-message">{t(I18N.contact.fields.message, lang)}</label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder={t(I18N.contact.placeholder.message, lang)}
        />
      </div>

      <button type="submit" className="cf-send" disabled={pending}>
        {pending ? t(I18N.contact.sending, lang) : t(I18N.contact.send, lang)}
      </button>

      {feedbackKey && (
        <p
          className={`cf-feedback ${status === 'sent' ? 'is-ok' : 'is-error'}`}
          role="status"
          aria-live="polite"
        >
          {t(I18N.contact.feedback[feedbackKey], lang)}
        </p>
      )}

      <p className="cf-or">
        {t(I18N.contact.or, lang)}
        <a
          href={LINKEDIN_URL}
          className="ulink magnetic"
          data-strength="0.3"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="scramble" data-text={t(I18N.contact.linkedin, lang)}>
            {t(I18N.contact.linkedin, lang)}
          </span>
        </a>
      </p>
    </form>
  );
}
