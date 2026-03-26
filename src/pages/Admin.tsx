import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, BookOpen, AlertCircle, Loader, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RosterUser {
  id: string;
  name: string;
  completedModules: number;
  averageScore: number;
}

export default function Admin() {
  const [roster, setRoster] = useState<RosterUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCSV = () => {
    const headers = ['Employee Name', 'Modules Completed', 'Average Score', 'Status'];
    const rows = roster.map(user => [
      user.name,
      `${user.completedModules} / 13`,
      user.averageScore > 0 ? `${user.averageScore}%` : 'N/A',
      user.completedModules === 13 ? 'Certified' : 'In Progress'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(comp => `"${comp}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'Manitou_Training_Roster.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profileErr } = await supabase
        .from('profiles')
        .select('id, display_name');

      if (profileErr) throw profileErr;

      // Fetch all progress
      const { data: progress, error: progressErr } = await supabase
        .from('progress')
        .select('user_id, module_id, status, score_percent');

      if (progressErr) throw progressErr;

      // Aggregate data
      const userMap: Record<string, RosterUser> = {};
      profiles.forEach((p) => {
        userMap[p.id] = { id: p.id, name: p.display_name || 'Unknown', completedModules: 0, averageScore: 0 };
      });

      const scoresTemp: Record<string, number[]> = {};

      progress.forEach((track) => {
        if (!userMap[track.user_id]) return;
        if (track.status === 'completed') {
          userMap[track.user_id].completedModules += 1;
        }
        
        if (!scoresTemp[track.user_id]) scoresTemp[track.user_id] = [];
        if (track.score_percent > 0) scoresTemp[track.user_id].push(track.score_percent);
      });

      // Calculate averages
      const aggregated = Object.values(userMap).map((u) => {
        const scores = scoresTemp[u.id] || [];
        u.averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return u;
      });

      // Sort by least completed (requires attention) at the top
      aggregated.sort((a, b) => a.completedModules - b.completedModules);

      setRoster(aggregated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-color)', padding: '0.75rem', borderRadius: '12px', color: '#111' }}>
            <Users size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Admin Dashboard</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Employee Progress Roster</p>
          </div>
        </div>
        
        {roster.length > 0 && !loading && (
          <button onClick={exportToCSV} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Download size={18} /> Export CSV
          </button>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {errorMsg && (
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', color: '#fca5a5', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <AlertCircle size={24} />
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader className="animate-spin" size={32} color="var(--primary-color)" />
          </div>
        ) : roster.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            No users registered yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Employee Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Modules Completed</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Avg Score</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((user) => {
                  const done = user.completedModules === 13;
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <BookOpen size={16} color={done ? 'var(--primary-color)' : 'var(--text-secondary)'} />
                          <span style={{ color: done ? 'var(--primary-color)' : 'white' }}>{user.completedModules} / 13</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {user.averageScore > 0 ? `${user.averageScore}%` : '-'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {done ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>
                            Certified
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
