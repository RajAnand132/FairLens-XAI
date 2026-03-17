import React from 'react';
import Card from './Card';
import { ShieldAlert, Info } from 'lucide-react';

const BiasAlerter = () => {
  // In a real application, this data would come from the live fairness audit microservice
  const mockBiasData = {
    detected: true,
    severity: 'Medium',
    flaggedAttribute: 'Age',
    message: "Statistical parity difference detected. Applicants between 18-24 are experiencing a 12% higher rejection rate compared to the baseline, controlling for income and debt.",
    recommendation: "Review the model weights for 'Credit History Length' which may be inadvertently proxying for Age."
  };

  if (!mockBiasData.detected) return null;

  return (
    <Card 
      className="border-warning"
      style={{ borderLeft: '4px solid var(--warning)', background: 'linear-gradient(to right, rgba(245, 158, 11, 0.1), transparent)' }}
    >
      <div className="flex items-start gap-4">
        <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.75rem', borderRadius: '50%', color: 'var(--warning)', flexShrink: 0 }}>
          <ShieldAlert size={28} />
        </div>
        
        <div>
          <h3 style={{ color: 'var(--warning)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Fairness Alert 
            <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', background: 'var(--warning)', color: '#000', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {mockBiasData.severity} Priority
            </span>
          </h3>
          
          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', lineHeight: 1.5 }}>
            <strong>Flagged Attribute:</strong> {mockBiasData.flaggedAttribute} <br/>
            {mockBiasData.message}
          </p>
          
          <div className="flex items-start gap-2" style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            <Info size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ color: 'var(--text-muted)' }}><strong>AI Recommendation:</strong> {mockBiasData.recommendation}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BiasAlerter;
