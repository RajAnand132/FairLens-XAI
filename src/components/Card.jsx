import React from 'react';

const Card = ({ children, className = '', title, subtitle, animate = true }) => {
  return (
    <div className={`glass-panel ${animate ? 'animate-in' : ''} ${className}`} style={{ padding: '2rem', marginBottom: '1.5rem' }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '1.5rem' }}>
          {title && <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>{title}</h3>}
          {subtitle && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
