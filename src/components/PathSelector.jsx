import React from 'react';
import { PencilLine, ShieldCheck, ArrowRight } from 'lucide-react';

const PathSelector = ({ onSelect, isLocked }) => {
  return (
    <div className="animate-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="section-title" style={{ marginBottom: '1rem' }}>
          {isLocked ? 'Application Review' : 'How would you like to proceed?'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          {isLocked 
            ? 'Your application is currently being audited. Editing is disabled during the review process.'
            : 'Choose your preferred method for completing your loan application with AI-driven fairness auditing.'}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', 
        gap: '2.5rem', 
        opacity: isLocked ? 0.6 : 1 
      }}>
        <div 
          className="glass-panel path-card" 
          onClick={() => onSelect('manual')}
          style={{ cursor: 'pointer' }}
        >
          <div className="path-icon">
            <PencilLine size={64} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Standard Application</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>
            Manually enter your financial data for a granular, step-by-step auditing experience. Best if you have data ready.
          </p>
          <div className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>
            {isLocked ? 'View Data' : 'Start Manual'} <ArrowRight size={18} />
          </div>
        </div>

        <div 
          className="glass-panel path-card" 
          onClick={() => onSelect('upload')}
          style={{ cursor: 'pointer' }}
        >
          <div className="path-icon">
            <ShieldCheck size={64} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Instant Vault Processing</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>
            Securely upload your bank statement. Our Gemini AI will extract data it needs within seconds. 100% Private.
          </p>
          <div className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>
            {isLocked ? 'In Review' : 'Upload Document'} <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathSelector;
