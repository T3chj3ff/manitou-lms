import { useEffect } from 'react';
import { supabase } from './supabase';

/**
 * Tracks user interaction (mouse, keyboard, scroll, touch). 
 * If no interaction occurs within the specified timeout (default 15 minutes), 
 * the user is automatically logged out to protect sensitive municipal data.
 */
export function useIdleTimeout(timeoutMs = 15 * 60 * 1000) {
  useEffect(() => {
    let timeoutId: number;

    const resetTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Send logout command to Supabase
          await supabase.auth.signOut();
          // Force redirect to login page with a timeout flag
          window.location.href = '/login?timeout=true';
        }
      }, timeoutMs);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    
    // Attach event listeners
    events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));
    
    // Start initial timer
    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [timeoutMs]);
}
