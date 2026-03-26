import { Link, Navigate } from 'react-router-dom';
import { Award, Printer, ArrowLeft, CheckCircle } from 'lucide-react';
import { useProgress } from '../lib/useProgress';

export default function Certificate() {
  const { progressPercent, userName, department } = useProgress();

  if (progressPercent < 100) {
    return <Navigate to="/" />;
  }

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/" className="print-hide" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="print-hide" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary flex items-center" onClick={() => window.print()}>
            <Printer size={18} /> Print Certificate
          </button>
          <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=HijPDrh3Ck6SkdPKrk9zNBPbhfI_0cBGsf0d79M-VtRUNzA2Wk0xT05NRzJTN0UzUFNNWUFJUDk2Si4u" target="_blank" rel="noreferrer" className="btn btn-primary pulse-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> Register Completion with HR
          </a>
        </div>
      </div>

      <div className="glass-panel certificate-card" style={{ 
        padding: '5rem', 
        background: '#ffffff',
        color: '#111827',
        border: '12px double #10b981',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '150px', height: '150px', borderRight: '2px solid #10b981', borderBottom: '2px solid #10b981', background: 'rgba(16, 185, 129, 0.03)' }}></div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '150px', height: '150px', borderLeft: '2px solid #10b981', borderTop: '2px solid #10b981', background: 'rgba(16, 185, 129, 0.03)' }}></div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <Award size={90} color="#f59e0b" style={{ margin: '0 auto 2rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
          
          <h1 style={{ color: '#0f172a', fontSize: '3.5rem', textTransform: 'uppercase', letterSpacing: '4px', margin: '0 0 1rem 0' }}>
            Certificate of Completion
          </h1>
          
          <div style={{ padding: '0 2rem' }}>
            <p style={{ fontSize: '1.5rem', color: '#64748b', margin: '3rem 0 1rem' }}>
              PROUDLY PRESENTED TO
            </p>
            <div style={{ 
              color: '#0f172a', 
              fontSize: '3.5rem', 
              fontWeight: 800, 
              fontFamily: 'serif',
              margin: '0 auto 0.5rem',
              paddingBottom: '0',
              display: 'inline-block',
              minWidth: '50%'
            }}>
              {userName}
            </div>
            
            <div style={{ 
              color: '#10b981', 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              margin: '0 auto 3rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e2e8f0',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {department}
            </div>
            
            <p style={{ fontSize: '1.5rem', color: '#475569', margin: '0 0 2rem' }}>
              for successfully completing the
            </p>
          
            <h2 style={{ color: '#10b981', fontSize: '2.5rem', marginBottom: '2rem' }}>
              AccessHubCOMS Accessibility Training
            </h2>
            
            <div style={{ fontSize: '1.2rem', color: '#334155', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: '1.8' }}>
              All 13 digital accessibility modules successfully completed with passing quiz scores, demonstrating a commitment to creating inclusive experiences for everyone.
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6rem', marginTop: '4rem' }}>
              <div style={{ borderTop: '2px solid #94a3b8', paddingTop: '1rem', width: '250px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{date}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Date of Completion</div>
              </div>
              <div style={{ borderTop: '2px solid #94a3b8', paddingTop: '1rem', width: '250px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a' }}>City of Manitou Springs</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>"Access is Our Culture"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body { background: white !important; }
          .btn, header { display: none !important; }
          .certificate-card { box-shadow: none !important; border: 4px solid black !important; }
        }
      `}</style>
    </div>
  );
}
