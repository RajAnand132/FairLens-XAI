/**
 * Global application settings for financial simulation and constraints.
 * These values control the maximum limits of sliders and input validations.
 */
export const SLIDER_SETTINGS = {
  income: {
    label: 'Monthly Income',
    min: 1000,
    max: 500000,
    step: 1000,
  },
  totalDebt: {
    label: 'Monthly Debt Obligations',
    min: 0,
    max: 200000,
    step: 500,
  },
  loanAmount: {
    label: 'Requested Loan Amount',
    min: 10000,
    max: 5000000,
    step: 5000,
  },
  creditScore: {
    label: 'Credit Score',
    min: 300,
    max: 900,
    step: 1,
  },
};

export const APP_CONFIG = {
  currency: 'INR',
  locale: 'en-IN',
  thresholds: {
    approval: 50,
    highConfidence: 75,
    warningDTI: 0.35,
    dangerDTI: 0.45,
  }
};
