import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import quizzesData from '../data/quizzes.json';
import { useProgress } from '../lib/useProgress';

export default function QuizViewer() {
  const { id } = useParams();
  const { markCompleted, markStarted, saveScore, progressPercent } = useProgress();
  
  if (!id || !quizzesData[id as keyof typeof quizzesData]) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Quiz not found. <Link to="/">Go Home</Link></div>;
  }
  
  useEffect(() => {
    if (id) markStarted(id);
  }, [id, markStarted]);
  
  const questions = quizzesData[id as keyof typeof quizzesData];
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentIdx];
  
  // Extract correct letter from something like 'A' or 'True'
  const isCorrect = (rawOpt: string) => {
    if (!question.correct_answer) return false;
    const ans = question.correct_answer.trim().toUpperCase();
    const cleanOpt = rawOpt.replace(/^- /, '').trim().toUpperCase();
    return cleanOpt.startsWith(ans) || cleanOpt === ans;
  };

  const cleanOptText = (text: string) => {
    return text.replace(/✅/g, '').replace(/✓/g, '').trim();
  };

  const handleSelect = (opt: string) => {
    if (showExplanation) return;
    setSelectedOption(opt);
    setShowExplanation(true);
    
    if (isCorrect(opt)) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      const finalScorePct = Math.round((score / questions.length) * 100);
      saveScore(id, finalScorePct);
      if (finalScorePct >= 70) {
        markCompleted(id);
      }
    }
  };

  const passThreshold = Math.ceil(questions.length * 0.7);
  const passed = score >= passThreshold;

  if (isFinished) {
    return (
      <div className="animate-fade-in glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        {passed ? (
          <div>
            <div className="pulse-primary" style={{ display: 'inline-block', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <Award size={64} color="var(--primary-color)" />
            </div>
            <h1 style={{ color: 'var(--primary-color)' }}>Congratulations!</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You passed Module {id} with a score of <strong>{score} / {questions.length}</strong>.</p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/" className="btn btn-secondary">Return to Dashboard</Link>
              {progressPercent === 100 ? (
                <Link to="/certificate" className="btn btn-accent">Claim Certificate!</Link>
              ) : (
                <Link to="/" className="btn btn-primary">Continue Training</Link>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'inline-block', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <XCircle size={64} color="var(--danger-color)" />
            </div>
            <h1 style={{ color: 'var(--danger-color)' }}>Almost there!</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You scored <strong>{score} / {questions.length}</strong>. You need {passThreshold} to pass.</p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to={`/module/${id}`} className="btn btn-secondary">Review Material</Link>
              <button onClick={() => { setCurrentIdx(0); setScore(0); setSelectedOption(null); setShowExplanation(false); setIsFinished(false); }} className="btn btn-primary">
                <RotateCcw size={18} /> Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to={`/module/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Module
        </Link>
        <span style={{ background: 'var(--surface-color)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid var(--surface-border)' }}>
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '2rem', lineHeight: '1.4' }}>{question.question}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {question.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const correct = isCorrect(opt);
            
            let bg = 'rgba(255, 255, 255, 0.03)';
            let borderColor = 'var(--surface-border)';
            let icon = null;
            
            if (showExplanation) {
              if (correct) {
                bg = 'rgba(16, 185, 129, 0.15)';
                borderColor = 'var(--primary-color)';
                icon = <CheckCircle size={20} color="var(--primary-color)" />;
              } else if (isSelected) {
                bg = 'rgba(239, 68, 68, 0.15)';
                borderColor = 'var(--danger-color)';
                icon = <XCircle size={20} color="var(--danger-color)" />;
              }
            } else if (isSelected) {
              bg = 'rgba(255, 255, 255, 0.1)';
              borderColor = 'var(--text-secondary)';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={showExplanation}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  cursor: showExplanation ? 'default' : 'pointer',
                  background: bg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-family)'
                }}
                onMouseEnter={(e) => {
                  if (!showExplanation) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!showExplanation) e.currentTarget.style.background = bg;
                }}
              >
                <span>{cleanOptText(opt)}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="animate-fade-in" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid var(--accent-color)', borderRadius: '0 8px 8px 0' }}>
            <strong style={{ color: 'var(--accent-color)', display: 'block', marginBottom: '0.5rem' }}>Explanation:</strong>
            {question.explanation}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
          <button 
            onClick={handleNext} 
            disabled={!showExplanation}
            className="btn btn-primary"
            style={{ padding: '0.8rem 2rem' }}
          >
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
