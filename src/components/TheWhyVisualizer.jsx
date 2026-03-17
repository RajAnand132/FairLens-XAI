import React from 'react';
import Card from './Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { Info } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.value > 0;
    return (
      <div style={{ 
        background: 'rgba(15, 17, 26, 0.95)', 
        border: '1px solid var(--border-light)', 
        padding: '1rem', 
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        maxWidth: '250px'
      }}>
        <p style={{ fontWeight: 600, margin: '0 0 0.5rem 0', color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
          {data.name}
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {data.description}
        </p>
      </div>
    );
  }
  return null;
};

const TheWhyVisualizer = ({ factors, aiExplanation }) => {
  if (!factors || factors.length === 0) return null;

  return (
    <Card 
      title="The 'Why' Behind the Decision" 
      subtitle="Understand exactly which factors influenced our AI's decision on your application."
    >
      
      {/* Gemini AI Plain Language Explanation */}
      {aiExplanation && (
        <div style={{ 
          background: 'rgba(79, 70, 229, 0.1)', 
          borderLeft: '4px solid var(--primary)', 
          padding: '1.5rem', 
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <Info size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>AI Summary</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>{aiExplanation}</p>
          </div>
        </div>
      )}

      {/* SHAP Values Chart (Simplified for Applicant) */}
      <div style={{ height: '300px', width: '100%', marginTop: '2rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={factors}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <ReferenceLine x={0} stroke="var(--border-light)" />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {factors.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value > 0 ? 'var(--success)' : 'var(--danger)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
        <span>← Hurt Approval Odds</span>
        <span>Improved Approval Odds →</span>
      </div>

    </Card>
  );
};

export default TheWhyVisualizer;
