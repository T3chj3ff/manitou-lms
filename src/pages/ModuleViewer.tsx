import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, PlayCircle, ClipboardList, VideoOff } from 'lucide-react';
import modulesData from '../data/modules.json';
import { useProgress } from '../lib/useProgress';

export default function ModuleViewer() {
  const { id } = useParams();
  const { isCompleted, markStarted } = useProgress();
  
  const [videoError, setVideoError] = useState(false);
  useEffect(() => setVideoError(false), [id]);

  const module = modulesData.find(m => m.id === id);
  if (!module) return <Navigate to="/" />;

  useEffect(() => {
    if (module) markStarted(module.id);
  }, [module, markStarted]);

  const completed = isCompleted(module.id);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>
              MODULE {module.id}
            </div>
            <h1 style={{ fontSize: '2.4rem', marginTop: 0 }}>{module.title}</h1>
          </div>
          
          <Link to={`/quiz/${module.id}`} className={completed ? "btn btn-secondary" : "btn btn-primary pulse-primary"}>
            <ClipboardList size={20} />
            {completed ? 'Retake Quiz' : 'Take Module Quiz'}
          </Link>
        </div>

        {/* Interactive Video Player */}
        {videoError ? (
          <div style={{ 
            marginTop: '2rem', marginBottom: '3rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(14,165,233,0.03) 100%)', 
            borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center',
            border: '1px solid rgba(16,185,129,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <VideoOff size={40} color="var(--primary-color)" style={{ opacity: 0.8 }} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', color: 'var(--text-primary)' }}>Video Coming Soon</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
              The whiteboard video for <strong style={{color: 'var(--text-primary)'}}>Module {module.id}</strong> is currently in production. In the meantime, please read the detailed course material below to proceed.
            </p>
          </div>
        ) : module.youtubeId ? (
          <div style={{ marginTop: '2rem', marginBottom: '3rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--surface-border)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)', aspectRatio: '16/9' }}>
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${module.youtubeId}?rel=0`} 
              title={`${module.title} Video`}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div style={{ marginTop: '2rem', marginBottom: '3rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--surface-border)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
            <div style={{ background: '#000', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <PlayCircle size={16} color="var(--primary-color)" /> NotebookLM Deep Dive
            </div>
            <video 
              controls 
              style={{ width: '100%', display: 'block', maxHeight: '500px', background: '#000' }}
              onError={() => setVideoError(true)}
              src={`/videos/${module.id}.mp4`}
              poster="/video-poster.jpg"
            >
              <track kind="captions" src={`/captions/${module.id}.vtt`} srcLang="en" label="English" default />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="markdown-body">
          <ReactMarkdown>{module.content}</ReactMarkdown>
        </div>
        
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--surface-border)', textAlign: 'center' }}>
          <h2>Ready to test your knowledge?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You need to score 70% or higher to pass this module.
          </p>
          <Link to={`/quiz/${module.id}`} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Start Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
