import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

export function useProgress() {
  const { user } = useAuth();
  
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [startedModules, setStartedModules] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [userName, setUserName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'Employee');
      setDepartment(user.user_metadata?.department || 'City Employee');
      fetchProgress();
    } else {
      setCompletedQuizzes([]);
      setStartedModules([]);
      setQuizScores({});
      setUserName('');
      setDepartment('');
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('progress')
      .select('module_id, status, score_percent')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching progress:', error);
      return;
    }

    if (data) {
      const completed: string[] = [];
      const started: string[] = [];
      const scores: Record<string, number> = {};

      data.forEach((row) => {
        if (row.status === 'completed') completed.push(row.module_id);
        if (row.status === 'started') started.push(row.module_id);
        scores[row.module_id] = row.score_percent;
      });

      setCompletedQuizzes(completed);
      setStartedModules(started);
      setQuizScores(scores);
    }
  };

  const markStarted = useCallback(async (moduleId: string) => {
    if (!user) return;
    setStartedModules(prev => prev.includes(moduleId) ? prev : [...prev, moduleId]);

    await supabase
      .from('progress')
      .upsert({ user_id: user.id, module_id: moduleId, status: 'started' }, { onConflict: 'user_id,module_id', ignoreDuplicates: true });
  }, [user]);

  const markCompleted = useCallback(async (moduleId: string) => {
    if (!user) return;
    setCompletedQuizzes(prev => prev.includes(moduleId) ? prev : [...prev, moduleId]);

    await supabase
      .from('progress')
      .upsert({ user_id: user.id, module_id: moduleId, status: 'completed' }, { onConflict: 'user_id,module_id' });
  }, [user]);

  const saveScore = useCallback(async (moduleId: string, scorePercent: number) => {
    if (!user) return;
    setQuizScores(prev => {
      const existing = prev[moduleId] || 0;
      if (scorePercent > existing) {
        // Sync to cloud if strictly better
        supabase.from('progress').upsert(
          { user_id: user.id, module_id: moduleId, status: 'completed', score_percent: scorePercent },
          { onConflict: 'user_id,module_id' }
        ).then(({ error }) => {
          if (error) console.error('Error saving score:', error);
        });
        return { ...prev, [moduleId]: scorePercent };
      }
      return prev;
    });
  }, [user]);

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
    userName, setUserName,
    department, setDepartment
  };
}
