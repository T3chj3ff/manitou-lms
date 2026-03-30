import { useState, useRef, useEffect } from 'react';

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [modalOpen]);

  // Handle click outside to close dialog natively
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setModalOpen(false);
    }
  };

  return (
    <footer style={{
      width: '100%',
      padding: '2rem 1.5rem',
      marginTop: 'auto',
      borderTop: '1px solid var(--surface-border)',
      background: 'var(--surface-overlay-subtle)',
      textAlign: 'center',
      color: 'var(--text-secondary)',
      fontSize: '0.85rem',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <div>
          &copy; {new Date().getFullYear()} A <strong>GABAnode Lab</strong> product. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.25rem' }}>
          <button 
            onClick={() => setModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: 'inherit',
              padding: 0
            }}
            aria-label="View formal Accessibility Statement"
          >
            Accessibility Statement
          </button>
        </div>
      </div>

      <dialog 
        ref={dialogRef}
        onClose={() => setModalOpen(false)}
        onClick={handleBackdropClick}
        aria-labelledby="a11y-title"
        aria-describedby="a11y-desc"
        style={{
          margin: 'auto',
          padding: '2.5rem',
          maxWidth: '600px',
          width: '90%',
          border: '1px solid var(--surface-border)',
          borderRadius: '16px',
          color: 'var(--text-primary)',
          background: 'var(--surface-color-solid)', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        <h2 id="a11y-title" style={{ marginTop: 0, marginBottom: '1.25rem' }}>Accessibility Statement</h2>
        <div id="a11y-desc" style={{ textAlign: 'left', lineHeight: 1.6, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>GABAnode Lab</strong> is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We adhere to the <strong>Web Content Accessibility Guidelines (WCAG) 2.2</strong> at the <strong>Level AA</strong> standard. These guidelines govern how to make web content more accessible to people with a wide array of disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            If you encounter any accessibility barriers on our platform, please contact our support team immediately so we can remediate the issue.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setModalOpen(false)}
            aria-label="Close accessibility statement modal"
          >
            Close
          </button>
        </div>
      </dialog>
      
      <style>{`
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
        }
      `}</style>
    </footer>
  );
}
