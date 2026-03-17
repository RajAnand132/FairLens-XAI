import React from 'react';

const Slider = ({ 
  label, 
  id, 
  min, 
  max, 
  step = 1, 
  value, 
  onChange, 
  formatValue = (v) => v,
  color = 'var(--primary)'
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="form-group" style={{ marginBottom: '2rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
        {label && <label htmlFor={id} className="form-label" style={{ margin: 0 }}>{label}</label>}
        <span style={{ fontWeight: 600, color: color }}>
          {formatValue(value)}
        </span>
      </div>
      
      <div style={{ position: 'relative', height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px' }}>
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, height: '100%', 
            width: `${percentage}%`, 
            background: color,
            borderRadius: '3px',
            boxShadow: `0 0 10px ${color}`
          }}
        />
        <input 
          type="range" 
          id={id} 
          min={min} 
          max={max} 
          step={step}
          value={value} 
          onChange={onChange}
          style={{
            position: 'absolute',
            top: '-5px',
            left: 0,
            width: '100%',
            opacity: 0,
            cursor: 'pointer',
            height: '16px'
          }}
        />
        {/* Custom Thumb */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: `calc(${percentage}% - 8px)`,
            width: '16px',
            height: '16px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
          }}
        />
      </div>
      <div className="flex justify-between" style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

export default Slider;
