import React, { useState, useEffect } from 'react';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { User, IndianRupee, CreditCard, Activity, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DataInputForm = ({ prefillData = null, onSubmit, isLocked }) => {
  const { sliderSettings } = useSettings();
  const [formData, setFormData] = useState({
    age: '',
    name: '',
    gender: '',
    ethnicity: 'Not Disclosed',
    income: '',
    employmentStatus: '',
    creditScore: '',
    totalDebt: '',
    loanAmount: '',
    purpose: '',
    tenureMonths: '36',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({ ...prev, ...prefillData }));
    }
  }, [prefillData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2)
      newErrors.name = 'Please enter your full name';
    
    if (!formData.age || Number(formData.age) < 18 || Number(formData.age) > 100)
      newErrors.age = 'Enter a valid age (18–100)';
    
    if (!formData.gender)
      newErrors.gender = 'Please select a gender option';
    
    const incomeNum = Number(formData.income);
    if (!formData.income || incomeNum <= 0)
      newErrors.income = 'Enter a valid monthly income';
    else if (incomeNum > sliderSettings.income.max)
      newErrors.income = `Income exceeds current tier limit (max ₹${sliderSettings.income.max.toLocaleString('en-IN')})`;

    const debtNum = Number(formData.totalDebt);
    if (formData.totalDebt === '' || debtNum < sliderSettings.totalDebt.min)
      newErrors.totalDebt = `Enter total debt (${sliderSettings.totalDebt.min} if none)`;
    else if (debtNum > sliderSettings.totalDebt.max)
      newErrors.totalDebt = `Debt exceeds limit (max ₹${sliderSettings.totalDebt.max.toLocaleString('en-IN')})`;

    if (!formData.employmentStatus)
      newErrors.employmentStatus = 'Please select employment status';

    const creditNum = Number(formData.creditScore);
    if (!formData.creditScore || creditNum < sliderSettings.creditScore.min || creditNum > sliderSettings.creditScore.max)
      newErrors.creditScore = `Enter a valid credit score (${sliderSettings.creditScore.min}–${sliderSettings.creditScore.max})`;

    const loanNum = Number(formData.loanAmount);
    if (!formData.loanAmount || loanNum <= 0)
      newErrors.loanAmount = 'Enter a valid loan amount';
    else if (loanNum > sliderSettings.loanAmount.max)
      newErrors.loanAmount = `Loan amount exceeds tier limit (max ₹${sliderSettings.loanAmount.max.toLocaleString('en-IN')})`;

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  const SectionHeader = ({ num, label }) => (
    <h4 style={{
      fontSize: '0.72rem',
      color: 'var(--primary)',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginBottom: '1.25rem',
      marginTop: '0.5rem',
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      <span style={{
        width: 20, height: 20,
        background: 'var(--primary-dim)',
        border: '1px solid var(--border-active)',
        borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)',
        flexShrink: 0,
      }}>{num}</span>
      {label}
    </h4>
  );

  const FieldError = ({ field }) =>
    errors[field] ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', color: 'var(--danger)', fontSize: '0.72rem' }}>
        <AlertCircle size={12} />
        {errors[field]}
      </div>
    ) : null;

  return (
    <Card
      title="Standard Disclosure"
      subtitle="Manually enter your financial details for a step-by-step fairness audit."
      className="animate-in"
    >
      <form onSubmit={handleSubmit} noValidate style={{ marginTop: '1.5rem' }}>

        {/* Section 1 – Demographics */}
        <div style={{ marginBottom: '2.5rem' }}>
          <SectionHeader num="1" label="Identity & Demographics" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <Input label="Full Name" id="name" type="text" value={formData.name || ''}
                onChange={handleChange} icon={User} placeholder="e.g. Raj" disabled={isLocked} />
              <FieldError field="name" />
            </div>
            <div>
              <Input label="Age" id="age" type="number" value={formData.age || ''}
                onChange={handleChange} icon={User} placeholder="e.g. 28" disabled={isLocked} />
              <FieldError field="age" />
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-input"
                  value={formData.gender || ''} onChange={handleChange} disabled={isLocked}
                  style={{
                    borderColor: errors.gender ? 'var(--danger)' : '',
                    opacity: isLocked ? 0.6 : 1,
                    cursor: isLocked ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <FieldError field="gender" />
            </div>
          </div>
        </div>

        {/* Section 2 – Financials */}
        <div style={{ marginBottom: '2.5rem' }}>
          <SectionHeader num="2" label="Financial Vector" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <Input label="Monthly Income (₹)" id="income" type="number"
                value={formData.income || ''} onChange={handleChange}
                icon={IndianRupee} placeholder="e.g. 75000" disabled={isLocked} />
              <FieldError field="income" />
            </div>
            <div>
              <Input label="Total Current Debt (₹)" id="totalDebt" type="number"
                value={formData.totalDebt || ''} onChange={handleChange}
                icon={CreditCard} placeholder="e.g. 25000 (or 0)" disabled={isLocked} />
              <FieldError field="totalDebt" />
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select name="employmentStatus" className="form-input"
                  value={formData.employmentStatus || ''} onChange={handleChange}
                  disabled={isLocked}
                  style={{
                    borderColor: errors.employmentStatus ? 'var(--danger)' : '',
                    opacity: isLocked ? 0.6 : 1,
                    cursor: isLocked ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">Select status...</option>
                  <option value="Employed">Full-Time (Stable)</option>
                  <option value="Self-Employed">Self-Employed (Dynamic)</option>
                  <option value="Unemployed">Liquid / Seeking</option>
                </select>
              </div>
              <FieldError field="employmentStatus" />
            </div>
            <div>
              <Input label={`Credit Score (${sliderSettings.creditScore.min}–${sliderSettings.creditScore.max})`} id="creditScore" type="number"
                value={formData.creditScore || ''} onChange={handleChange}
                icon={Activity} placeholder="e.g. 720" disabled={isLocked} />
              <FieldError field="creditScore" />
            </div>
          </div>
        </div>

        {/* Section 3 – Loan Request */}
        <div style={{ marginBottom: '2.5rem' }}>
          <SectionHeader num="3" label="Request Parameters" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <Input label="Requested Capital (₹)" id="loanAmount" type="number"
                value={formData.loanAmount || ''} onChange={handleChange}
                icon={IndianRupee} placeholder="e.g. 500000" disabled={isLocked} />
              <FieldError field="loanAmount" />
            </div>
            <div>
              <Input label="Tenure (Months)" id="tenureMonths" type="number"
                value={formData.tenureMonths || ''} onChange={handleChange}
                icon={Calendar} placeholder="e.g. 36" disabled={isLocked} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          icon={ArrowRight} 
          disabled={isLocked}
          style={{ opacity: isLocked ? 0.6 : 1, cursor: isLocked ? 'not-allowed' : 'pointer' }}
        >
          {isLocked ? 'Application Submitted' : 'Execute Fairness Audit'}
        </Button>
      </form>
    </Card>
  );
};

export default DataInputForm;
