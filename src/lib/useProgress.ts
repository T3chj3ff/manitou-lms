import { useState, useEffect, useCallback } from 'react';

// Dispatch a custom event so all hook instances sync instantly
const syncEventName = 'manitou-lms-progress-update';

export function useProgress() {
  const getSaved = () => {
    const saved = localStorage.getItem('manitou-lms-progress');
    return saved ? JSON.parse(saved) : [];
  };

  const getStarted = () => {
    const saved = localStorage.getItem('manitou-lms-started');
    return saved ? JSON.parse(saved) : [];
  };

  const getScores = () => {
    const saved = localStorage.getItem('manitou-lms-scores');
    return saved ? JSON.parse(saved) : {};
  };

  const getSavedName = () => {
    return localStorage.getItem('manitou-lms-username') || '';
  };

  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(getSaved);
  const [startedModules, setStartedModules] = useState<string[]>(getStarted);
  const [quizScores, setQuizScores] = useState<Record<string, number>>(getScores);
  const [userName, setUserNameState] = useState<string>(getSavedName);

  useEffect(() => {
    const handleSync = () => {
      setCompletedQuizzes(getSaved());
      setStartedModules(getStarted());
      setQuizScores(getScores());
      setUserNameState(getSavedName());
    };
    
    globalThis.addEventListener(syncEventName, handleSync);
    globalThis.addEventListener('storage', handleSync);
    
    return () => {
      globalThis.removeEventListener(syncEventName, handleSync);
      globalThis.removeEventListener('storage', handleSync);
    };
  }, []);

  const markCompleted = useCallback((moduleId: string) => {
    const current = getSaved();
    if (!current.includes(moduleId)) {
      const next = [...current, moduleId];
      localStorage.setItem('manitou-lms-progress', JSON.stringify(next));
      globalThis.dispatchEvent(new Event(syncEventName));
    }
  }, []);

  const markStarted = useCallback((moduleId: string) => {
    const current = getStarted();
    if (!current.includes(moduleId)) {
      const next = [...current, moduleId];
      localStorage.setItem('manitou-lms-started', JSON.stringify(next));
      globalThis.dispatchEvent(new Event(syncEventName));
    }
  }, []);

  const saveScore = useCallback((moduleId: string, scorePercent: number) => {
    const currentScores = getScores();
    const existingScore = currentScores[moduleId] || 0;
    if (scorePercent > existingScore) {
      currentScores[moduleId] = scorePercent;
      localStorage.setItem('manitou-lms-scores', JSON.stringify(currentScores));
      globalThis.dispatchEvent(new Event(syncEventName));
    }
  }, []);

  const setUserName = useCallback((name: string) => {
    localStorage.setItem('manitou-lms-username', name.trim());
    setUserNameState(name.trim());
    globalThis.dispatchEvent(new Event(syncEventName));
  }, []);

  const isCompleted = useCallback((moduleId: string) => {
    return completedQuizzes.includes(moduleId);
  }, [completedQuizzes]);

  const isStarted = useCallback((moduleId: string) => {
    return startedModules.includes(moduleId) && !completedQuizzes.includes(moduleId);
  }, [startedModules, completedQuizzes]);
  
  const progressPercent = Math.round((completedQuizzes.length / 13) * 100);

  return { 
    completedQuizzes, startedModules, quizScores, 
    markCompleted, markStarted, saveScore,
    isCompleted, isStarted, progressPercent, 
    userName, setUserName 
  };
}
