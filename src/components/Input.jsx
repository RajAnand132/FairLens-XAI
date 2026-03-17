import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  id, 
  value, 
  onChange, 
  placeholder,
  required = false,
  icon: Icon,
  disabled = false
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Icon size={18} />
          </div>
        )}
        <input 
          type={type} 
          id={id} 
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="form-input"
          style={{
            paddingLeft: Icon ? '2.75rem' : '1rem',
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text'
          }}
        />
      </div>
    </div>
  );
};

export default Input;
