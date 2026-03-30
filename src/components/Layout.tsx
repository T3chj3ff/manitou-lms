import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, ShieldCheck, CheckCircle, Menu, X, Sun, Moon, Lock, Users } from 'lucide-react';
import { useProgress } from '../lib/useProgress';
import { useIdleTimeout } from '../lib/useIdleTimeout';
import { useAuth } from '../lib/AuthContext';
import Footer from './Footer';
import modulesData from '../data/modules.json';

export default function Layout() {
  useIdleTimeout(); // Listen for 15-minute inactivity timeout

  const { progressPercent, isCompleted, isStarted, userName } = useProgress();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('manitou-lms-theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      localStorage.setItem('manitou-lms-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('manitou-lms-theme', 'dark');
    }
  }, [theme]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const SidebarContent = () => (
    <>
      <h3 style={{
        fontSize: '0.75rem', color: 'var(--text-secondary)',
        textTransform: 'uppercase', letterSpacing: '1px',
        marginBottom: '1rem', paddingLeft: '0.5rem'
      }}>
        Training Outline
      </h3>

      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem 1rem', borderRadius: '8px',
        background: location.pathname === '/' ? 'var(--surface-overlay-subtle)' : 'transparent',
        color: 'var(--text-primary)', textDecoration: 'none', marginBottom: '1rem',
      }}>
        <BookOpen size={18} /> Dashboard
      </Link>

      {isAdmin && (
        <Link to="/admin" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem 1rem', borderRadius: '8px',
          background: location.pathname === '/admin' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
          color: location.pathname === '/admin' ? 'var(--primary-color)' : 'var(--text-secondary)',
          textDecoration: 'none', marginBottom: '1rem',
          borderLeft: location.pathname === '/admin' ? '3px solid var(--primary-color)' : '3px solid transparent',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => { if (location.pathname !== '/admin') e.currentTarget.style.background = 'var(--surface-overlay-subtle)'; }}
        onMouseLeave={(e) => { if (location.pathname !== '/admin') e.currentTarget.style.background = 'transparent'; }}
        >
          <Users size={18} /> Admin Roster
        </Link>
      )}

      {modulesData.map((mod, index) => {
        const completed = isCompleted(mod.id);
        const started = isStarted(mod.id);
        
        // Prequisite check logic: Lock this module if the PREVIOUS module is NOT completed
        const isLocked = index > 0 && !isCompleted(modulesData[index - 1].id);
        
        const isActive = location.pathname.includes(`/module/${mod.id}`) || location.pathname.includes(`/quiz/${mod.id}`);
        return (
          <Link
            key={mod.id}
            to={isLocked ? '#' : `/module/${mod.id}`}
            onClick={(e) => isLocked && e.preventDefault()}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '8px',
              background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              color: isActive ? 'var(--primary-color)' : isLocked ? 'var(--surface-overlay-strong)' : 'var(--text-secondary)',
              textDecoration: 'none', transition: 'all 0.2s', fontSize: '0.9rem',
              borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
              cursor: isLocked ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!isActive && !isLocked) e.currentTarget.style.background = 'var(--surface-overlay-subtle)'; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
          >
            {isLocked
              ? <Lock size={16} color="var(--surface-overlay-heavy)" />
              : completed
                ? <CheckCircle size={16} color="var(--primary-color)" />
                : started
                  ? <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--accent-color)', position: 'relative', flexShrink: 0 }}><div style={{ position: 'absolute', top: '3px', left: '3px', width: '6px', height: '6px', background: 'var(--accent-color)', borderRadius: '50%' }} /></div>
                  : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-secondary)', flexShrink: 0 }} />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {mod.title}
            </span>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* ── Global Mountain Background (Pikes Peak ridge, fixed behind all content) ── */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          position: 'fixed', bottom: 0, left: 0,
          width: '100%', height: '260px',
          zIndex: 0, pointerEvents: 'none',
        }}
      >
        {/* Far peaks silhouette */}
        <path
          d="M0,320 L0,230 L90,215 L180,200 L260,183 L330,165 L388,144 L434,118
             L468,92 L494,68 L514,46 L530,28 L542,14 L553,5 L562,1 L572,0 L581,1
             L591,6 L602,16 L616,32 L634,54 L656,80 L682,108 L712,134 L746,156
             L786,174 L832,189 L886,202 L950,213 L1024,222 L1108,229 L1200,235
             L1300,240 L1380,243 L1440,245 L1440,320 Z"
          fill="rgba(16,185,129,0.04)"
        />
        {/* Mid ridge */}
        <path
          d="M0,320 L0,268 L180,260 L360,253 L520,249 L660,252 L780,256 L900,253
             L1020,257 L1150,262 L1300,267 L1440,270 L1440,320 Z"
          fill="rgba(16,185,129,0.035)"
        />
        {/* Near foothills — blue-sky tint */}
        <path
          d="M0,320 L0,292 L360,286 L720,288 L1080,291 L1440,293 L1440,320 Z"
          fill="rgba(14,165,233,0.025)"
        />
      </svg>

      {/* ── Header ── */}
      <header style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
        padding: '0.75rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>
        {/* Left: hamburger (mobile) + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {userName && (
            <button
              className="mobile-menu-btn"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
              style={{
                display: 'none', // shown via CSS below
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-primary)', padding: '0.4rem',
                borderRadius: '6px',
              }}
            >
              {drawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, var(--primary-color), #2dd4bf)', 
              borderRadius: '10px',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
              letterSpacing: '-0.5px',
              flexShrink: 0
            }}>
              MS
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>AccessHubCOMS</h1>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>City of Manitou Springs Training</span>
            </div>
          </Link>
        </div>

        {/* Right: toggle + progress ring + certificate */}
        {userName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.4rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-color)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              aria-label="Toggle Light/Dark Theme"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="20" cy="20" r={radius} stroke="var(--bg-color)" strokeWidth="4" fill="none" />
                  <circle
                    cx="20" cy="20" r={radius}
                    stroke="var(--primary-color)" strokeWidth="4" fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.62rem', fontWeight: 'bold',
                }}>
                  {progressPercent}%
                </div>
              </div>
              <span className="hidden-on-mobile" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Progress
              </span>
            </div>

            {progressPercent === 100 && location.pathname !== '/certificate' && (
              <Link to="/certificate" className="btn btn-accent animate-fade-in" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <ShieldCheck size={15} /> Certificate
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ── Body: sidebar + main ── */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', position: 'relative', zIndex: 1 }}>

        {/* Desktop sidebar */}
        {userName && (
          <aside style={{
            width: '280px', background: 'var(--surface-color)',
            borderRight: '1px solid var(--surface-border)',
            padding: '1.5rem', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '0.4rem',
          }} className="app-sidebar hidden-on-mobile">
            <SidebarContent />
          </aside>
        )}

        {/* Mobile drawer overlay */}
        {userName && drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 90, backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* Mobile drawer panel */}
        {userName && (
          <aside
            className="mobile-drawer"
            style={{
              position: 'fixed', top: '70px', left: 0, bottom: 0,
              width: '280px',
              background: 'var(--surface-color-solid)',
              borderRight: '1px solid var(--surface-border)',
              padding: '1.5rem', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
              zIndex: 95,
              transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            aria-hidden={!drawerOpen}
          >
            <SidebarContent />
          </aside>
        )}

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '2rem', flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: '1000px', width: '100%' }}>
              <Outlet />
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
