// Institutional Fairness Engine (Mock)

export const CASES = [
  {
    id: 'LX-9082',
    name: 'Sarah Chen',
    age: 28,
    gender: 'Female',
    ethnicity: 'Asian',
    income: 75000,
    loanAmount: 450000,
    creditScore: 680,
    totalDebt: 2500,
    employmentStatus: 'Employed',
    equityScore: 68,
    status: 'Review',
    assignedOfficerId: 'usr-off-001',
  },
  {
    id: 'LX-8812',
    name: 'Marcus Miller',
    age: 34,
    gender: 'Male',
    ethnicity: 'African American',
    income: 120000,
    loanAmount: 500000,
    creditScore: 820,
    totalDebt: 15000,
    employmentStatus: 'Employed',
    equityScore: 92,
    status: 'Auto',
    assignedOfficerId: 'usr-off-001',
  },
  {
    id: 'LX-7761',
    name: 'Priya Patel',
    age: 26,
    gender: 'Female',
    ethnicity: 'South Asian',
    income: 45000,
    loanAmount: 800000,
    creditScore: 580,
    totalDebt: 30000,
    employmentStatus: 'Self-Employed',
    equityScore: 45,
    status: 'Alert',
    assignedOfficerId: 'usr-off-002',
  },
];

export const analyzeLoanFairness = (formData, mode = 'Standard') => {
  if (!formData) formData = {};
  const income      = parseFloat(formData.income)      || 75000;
  const debt        = parseFloat(formData.totalDebt)   || 0;
  const loanAmount  = parseFloat(formData.loanAmount)  || 0;
  const creditScore = parseFloat(formData.creditScore) || 720;

  // Dynamic Thresholds based on Rigor Mode
  const capitalThreshold = mode === 'Extreme' ? 10000000 : mode === 'Fast' ? 1000000 : 2500000;

  const dti            = debt / (income === 0 ? 1 : income);
  const requestedRatio = loanAmount / (income === 0 ? 1 : income);

  let approved    = true;
  let probability = 85;
  const factors   = [];

  // ── DTI Vector ──────────────────────────────────────────────────────────────
  if (dti > 0.45) {
    approved = false;
    probability -= 40;
    factors.push({
      name: 'Debt-to-Income Ratio',
      value: -0.65,
      description: 'Current debt obligations exceed institutional stability thresholds (DTI > 45%).',
    });
  } else if (dti < 0.2) {
    probability += 10;
    factors.push({
      name: 'Debt-to-Income Ratio',
      value: 0.35,
      description: `Healthy debt load (DTI ${(dti * 100).toFixed(1)}%). Optimal balance between liabilities and earnings.`,
    });
  } else {
    factors.push({
      name: 'Debt-to-Income Ratio',
      value: 0.10,
      description: `Acceptable DTI of ${(dti * 100).toFixed(1)}%. Within the 20–45% standard range.`,
    });
  }

  // ── Capital Request Vector ───────────────────────────────────────────────────
  if (loanAmount > capitalThreshold) {
    probability -= 15;
    factors.push({
      name: 'Capital Stress',
      value: -0.20,
      description: `Large capital requests (> ₹${(capitalThreshold/100000).toFixed(0)}L) trigger additional institutional risk weighting.`,
    });
  }

  if (requestedRatio > 10) {
    approved = false;
    probability -= 25;
    factors.push({
      name: 'Income / Loan Ratio',
      value: -0.45,
      description: `Requested amount is ${requestedRatio.toFixed(1)}× monthly income — disproportionate to cash flow.`,
    });
  } else if (loanAmount > 0) {
    factors.push({
      name: 'Income / Loan Ratio',
      value: 0.15,
      description: `Loan-to-income ratio of ${requestedRatio.toFixed(1)}× is within manageable limits.`,
    });
  }

  // ── Credit Reliability Vector ────────────────────────────────────────────────
  if (creditScore < 640) {
    approved = false;
    probability -= 30;
    factors.push({
      name: 'Credit Score Index',
      value: -0.55,
      description: `Score of ${creditScore} is below the minimum threshold of 640 for this product tier.`,
    });
  } else if (creditScore >= 780) {
    probability += 20;
    factors.push({
      name: 'Credit Score Index',
      value: 0.50,
      description: `Excellent score of ${creditScore}. Demonstrates elite fiscal reliability.`,
    });
  } else {
    factors.push({
      name: 'Credit Score Index',
      value: 0.20,
      description: `Credit score of ${creditScore} meets standard requirements (640–779 range).`,
    });
  }

  // ── Bounded probability ──────────────────────────────────────────────────────
  probability = Math.min(Math.max(probability, 5), 98);

  // ── Remediation Action Plan ──────────────────────────────────────────────────
  const actionPlan  = [];
  let   nextBestOffer = null;

  if (!approved) {
    if (dti > 0.45)
      actionPlan.push({
        text: `Reduce your total monthly debt to bring DTI below 35%. Focus on clearing high-interest credit cards and personal loans first — even ₹${Math.round((dti - 0.35) * income).toLocaleString('en-IN')}/mo less in obligations moves you into the safe zone.`,
        effort: 'medium',
      });
    else if (dti > 0.35)
      actionPlan.push({
        text: `Your DTI of ${(dti * 100).toFixed(1)}% is borderline. Reducing monthly debt by ₹${Math.round((dti - 0.30) * income).toLocaleString('en-IN')} would bring you to 30% — well within the optimal range.`,
        effort: 'medium',
      });

    if (requestedRatio > 10) {
      nextBestOffer = income * 8;
      actionPlan.push({
        text: `Consider requesting ₹${Math.round(nextBestOffer).toLocaleString('en-IN')} instead — this is 8× your monthly income and aligns with institutional ratio limits, significantly improving approval odds.`,
        effort: 'quick',
      });
    }

    if (creditScore < 640)
      actionPlan.push({
        text: `Work on improving your credit score above 680 over the next 6 months: pay all bills on time, reduce credit utilisation below 30%, and dispute any errors on your credit report.`,
        effort: 'long',
      });
  } else {
    const maxLoan = income * 10;
    actionPlan.push({
      text: `Your profile is strong. Proceed to submit the full application with supporting documents: last 3 months' pay slips, 6 months bank statements, photo ID, and address proof.`,
      effort: 'quick',
    });
    actionPlan.push({
      text: `Based on your income, you may be eligible for up to ₹${Math.round(maxLoan).toLocaleString('en-IN')}. If your current request is lower, you have headroom to increase it.`,
      effort: 'quick',
    });
    if (creditScore < 780)
      actionPlan.push({
        text: `Improving your credit score from ${creditScore} to 780+ over 6–12 months could unlock premium rate tiers with lower interest — potentially saving thousands in interest costs.`,
        effort: 'long',
      });
  }

  return {
    approved,
    probability,
    factors,
    actionPlan,
    nextBestOffer,
    healthScore: probability,
    confidence: 0.94,
  };
};

// Legacy async wrappers (kept for compatibility)
export const simulateLoanDecision = async (formData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return analyzeLoanFairness(formData);
};

export const simulateFairnessAudit = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    biasDetected: false,
    confidence: 0.98,
    message: 'No significant bias detected across monitored demographic groups (Age, Gender).',
  };
};
