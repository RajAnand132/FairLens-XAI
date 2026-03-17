import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon: Icon,
  style: externalStyle = {},
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const widthStyle = fullWidth ? { width: '100%' } : {};
  const disabledStyle = disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {};

  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ ...widthStyle, ...disabledStyle, ...externalStyle }}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
