import React, { useEffect, useState } from 'react';
import Card from './Card';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatusDashboard = ({ result }) => {
  const [animatedProb, setAnimatedProb] = useState(0);

  useEffect(() => {
    if (result) {
      // Simple animation effect for the gauge
      let current = 0;
      const target = result.probability;
      const interval = setInterval(() => {
        current += Math.max(1, Math.round((target - current) / 5));
        if (current >= target) {
          setAnimatedProb(target);
          clearInterval(interval);
        } else {
          setAnimatedProb(current);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [result]);

  if (!result) return null;

  const isApproved = result.approved;
  const color = isApproved ? 'var(--success)' : 'var(--danger)';
  
  // Data for the half-donut gauge chart
  const data = [
    { name: 'Score', value: animatedProb },
    { name: 'Remaining', value: 100 - animatedProb }
  ];

  return (
    <Card className="text-center" subtitle="Real-time risk assessment powered by neural insights.">
      <div className="flex flex-col items-center">
        <div 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.8rem 2.5rem', 
            borderRadius: 'var(--radius-full)', 
            backgroundColor: isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${isApproved ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: color,
            marginBottom: '2.5rem',
            boxShadow: `0 0 20px ${isApproved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`
          }}
        >
          {isApproved ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
          <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '1.1rem', fontWeight: 800 }}>
            {isApproved ? 'Approved' : 'Action Required'}
          </h2>
        </div>

        {/* Probability Gauge */}
        <div style={{ position: 'relative', width: '100%', height: '220px', maxWidth: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={105}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={color} style={{ filter: `drop-shadow(0 0 15px ${color})` }} />
                <Cell fill="rgba(255, 255, 255, 0.05)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div style={{ position: 'absolute', bottom: '10px', left: '0', width: '100%', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '4.5rem', 
              fontWeight: 900, 
              lineHeight: 1, 
              color: "var(--text-main)",
              letterSpacing: '-2px',
              textShadow: `0 0 30px ${color}`
            }}>
              {animatedProb}%
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginTop: '0.5rem' }}>Confidence Level</p>
          </div>
        </div>

        {/* Financial Health Score */}
        <div style={{ 
            marginTop: '3rem', 
            padding: '2rem', 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }} />
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Health Grade</h4>
          <div style={{ 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            color: 'var(--text-main)',
            marginTop: '0.5rem',
            lineHeight: 1
          }}>
            {result.healthScore}<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>/ 100</span>
          </div>
          <div style={{ marginTop: '1rem', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${result.healthScore}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatusDashboard;
