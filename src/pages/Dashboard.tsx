import { Link } from 'react-router-dom';
import { Book, CheckCircle, Clock, ChevronRight, Video, BookOpen, LogOut } from 'lucide-react';
import modulesData from '../data/modules.json';
import { useProgress } from '../lib/useProgress';
import { useAuth } from '../lib/AuthContext';

export default function Dashboard() {
  const { isCompleted, isStarted, quizScores, userName, completedQuizzes, progressPercent } = useProgress();
  const { signOut } = useAuth();

  // Find the first incomplete module for "Continue Learning"
  const nextModule = modulesData.find((mod) => !isCompleted(mod.id));
  const allDone = completedQuizzes.length === modulesData.length;

  // Helper: strip markdown & pull first ~120 chars as description excerpt
  const getExcerpt = (content: string) => {
    const plain = content
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return plain.length > 120 ? plain.slice(0, 117) + '…' : plain;
  };

  return (
    <div className="animate-fade-in">

      {/* ── Hero / Logo Banner ── */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
        padding: '3rem 2rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(14,165,233,0.06) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(16,185,129,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative glow blobs */}
        <div style={{
          position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '200px',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.12), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Pikes Peak Mountain Silhouette ── */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 180"
          preserveAspectRatio="none"
          style={{
            position: 'absolute', bottom: 0, left: 0,
            width: '100%', height: '110px',
            pointerEvents: 'none',
          }}
        >
          {/* Far range — faint, highest peaks */}
          <path
            d="M0,180 L0,130 L70,118 L140,108 L210,96 L270,82 L320,65 L360,46 L392,28
               L415,14 L432,5 L448,1 L462,0 L476,1 L492,8 L510,20 L532,38 L558,60
               L588,82 L622,102 L660,118 L705,130 L760,139 L825,146 L900,152
               L990,157 L1090,160 L1200,162 L1200,180 Z"
            fill="rgba(16,185,129,0.07)"
          />
          {/* Mid range — slightly more visible */}
          <path
            d="M0,180 L0,152 L100,145 L200,138 L300,133 L390,130 L460,133 L530,137
               L600,130 L660,126 L720,129 L780,133 L850,137 L940,142 L1040,148
               L1140,153 L1200,156 L1200,180 Z"
            fill="rgba(16,185,129,0.09)"
          />
          {/* Near foothills — most visible, with a sky-blue tint */}
          <path
            d="M0,180 L0,166 L150,162 L300,158 L450,160 L600,162 L750,160 L900,163
               L1050,166 L1200,168 L1200,180 Z"
            fill="rgba(14,165,233,0.06)"
          />
          {/* Snow caps on Pikes Peak summit */}
          <path
            d="M432,7 L440,4 L448,2 L456,4 L468,10 L458,9 L448,7 L438,9 Z"
            fill="rgba(255,255,255,0.35)"
          />
        </svg>

        {/* Sign Out Button */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
          <button onClick={signOut} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';}} onMouseLeave={(e) => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';}}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Logo */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '90px', height: '90px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          border: '2px solid rgba(16,185,129,0.3)',
          marginBottom: '1.25rem',
          boxShadow: '0 0 32px rgba(16,185,129,0.15)',
        }}>
          <img
            src="/manitou-logo.png"
            alt="City of Manitou Springs"
            style={{ maxWidth: '68px', maxHeight: '68px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={40} color="var(--primary-color)" />
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          City of Manitou Springs
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Welcome, {userName}!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
          Complete all {modulesData.length} modules to earn your Digital Accessibility Certificate.
        </p>

        {/* Overall progress bar */}
        <div style={{ marginTop: '1.75rem', maxWidth: '360px', margin: '1.75rem auto 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Overall Progress</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>
              {completedQuizzes.length}/{modulesData.length} modules
            </span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, var(--primary-color), #34d399)',
              borderRadius: '99px',
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </div>

      {/* ── Continue Learning Banner ── */}
      {!allDone && nextModule && (
        <Link
          to={`/module/${nextModule.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(90deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.08) 100%)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(16,185,129,0.2)', borderRadius: '10px',
              padding: '0.65rem', display: 'flex', alignItems: 'center', flexShrink: 0
            }}>
              <ChevronRight size={22} color="var(--primary-color)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>
                Continue Learning
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Module {nextModule.id}: {nextModule.title}
              </div>
            </div>
          </div>
          <div style={{
            background: 'var(--primary-color)', color: 'white',
            padding: '0.5rem 1.1rem', borderRadius: '8px',
            fontSize: '0.85rem', fontWeight: 600, flexShrink: 0,
          }}>
            Resume →
          </div>
        </Link>
      )}

      {allDone && (
        <Link
          to="/certificate"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
            padding: '1.25rem 1.5rem', marginBottom: '2rem',
            background: 'linear-gradient(90deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
            border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle size={28} color="var(--accent-color)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>
                🎉 Training Complete!
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                All {modulesData.length} modules finished — download your certificate
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--accent-color)', color: '#111', padding: '0.5rem 1.1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
            Get Certificate →
          </div>
        </Link>
      )}

      {/* ── Section Header ── */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          All Modules
        </h2>
        <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {completedQuizzes.length} of {modulesData.length} complete
        </span>
      </div>

      {/* ── Module Cards Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.25rem',
      }}>
        {modulesData.map((mod) => {
          const completed = isCompleted(mod.id);
          const started = isStarted(mod.id);
          const score = quizScores[mod.id];
          const isNext = nextModule?.id === mod.id;
          const excerpt = getExcerpt('content' in mod ? (mod as Record<string, string>).content ?? '' : '');

          return (
            <Link
              key={mod.id}
              to={`/module/${mod.id}`}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                borderColor: isNext ? 'rgba(16,185,129,0.4)' : started ? 'rgba(245, 158, 11, 0.3)' : completed ? 'rgba(16,185,129,0.2)' : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 28px -8px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Status corner badge */}
              {completed && (
                <div style={{ position: 'absolute', top: 0, right: 0, borderBottomLeftRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem 0.65rem' }}>
                  <CheckCircle size={18} color="var(--primary-color)" />
                </div>
              )}
              {started && !completed && (
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-color)', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  In Progress
                </div>
              )}
              {isNext && !completed && !started && (
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--primary-color)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Up Next
                </div>
              )}

              {/* Icon + Title */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div style={{
                  background: completed ? 'rgba(16, 185, 129, 0.18)' : started ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.05)',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}>
                  <Book size={22} color={completed ? 'var(--primary-color)' : started ? 'var(--accent-color)' : 'var(--text-secondary)'} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary-color)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
                    MODULE {mod.id}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.0rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {mod.title}
                  </h3>
                </div>
              </div>

              {/* Description excerpt */}
              {excerpt && (
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  margin: '0 0 1rem',
                  flex: 1,
                }}>
                  {excerpt}
                </p>
              )}

              {/* Footer row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {score !== undefined ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      🏆 Best Score: <strong style={{ color: score === 100 ? 'var(--primary-color)' : 'var(--text-primary)' }}>{score}%</strong>
                    </span>
                  ) : (
                    <>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <Clock size={13} /> ~15 min
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <Video size={13} /> Video
                      </span>
                    </>
                  )}
                </div>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: completed ? 'var(--primary-color)' : isNext ? 'var(--primary-color)' : started ? 'var(--accent-color)' : 'var(--text-secondary)',
                }}>
                  {completed ? '✓ Done' : started ? 'Resume →' : 'Start →'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
