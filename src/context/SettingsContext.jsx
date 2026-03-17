import React, { createContext, useContext, useState, useEffect } from 'react';
import { SLIDER_SETTINGS } from '../data/settings';

const SettingsContext = createContext();

const PRECISION_PRESETS = {
  Fast: {
    incomeCap: 500000,
    debtCap: 200000,
    loanCap: 2000000,
    creditCap: 900
  },
  Standard: {
    incomeCap: 1500000,
    debtCap: 500000,
    loanCap: 10000000,
    creditCap: 900
  },
  Extreme: {
    incomeCap: 5000000,
    debtCap: 1500000,
    loanCap: 50000000,
    creditCap: 900
  }
};

export const SettingsProvider = ({ children, userId }) => {
  const [xaiPrecision, setXaiPrecisionInternal] = useState('Standard');
  const [sliderSettings, setSliderSettings] = useState(SLIDER_SETTINGS);
  const [oracleActive, setOracleActive] = useState(true);

  // Prefix keys with userId for isolation
  const getK = (base) => userId ? `fairlens_${userId}_${base}` : `fairlens_guest_${base}`;

  // Load user-specific settings when userId changes
  useEffect(() => {
    const savedPrecision = localStorage.getItem(getK('xai_precision'));
    if (savedPrecision) setXaiPrecisionInternal(savedPrecision);

    const savedSliders = localStorage.getItem(getK('slider_settings'));
    if (savedSliders) setSliderSettings(JSON.parse(savedSliders));
    else setSliderSettings(SLIDER_SETTINGS);

    const savedOracle = localStorage.getItem(getK('oracle_active'));
    if (savedOracle !== null) setOracleActive(JSON.parse(savedOracle));
    else setOracleActive(true);
  }, [userId]);

  // Apply presets when precision changes
  const setXaiPrecision = (mode) => {
    setXaiPrecisionInternal(mode);
    const preset = PRECISION_PRESETS[mode];
    if (preset) {
      setSliderSettings(prev => ({
        ...prev,
        income: { ...prev.income, max: preset.incomeCap },
        totalDebt: { ...prev.totalDebt, max: preset.debtCap },
        loanAmount: { ...prev.loanAmount, max: preset.loanCap },
        creditScore: { ...prev.creditScore, max: preset.creditCap }
      }));
    }
  };

  // Sync back to storage on changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(getK('slider_settings'), JSON.stringify(sliderSettings));
    }
  }, [sliderSettings, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(getK('xai_precision'), xaiPrecision);
    }
  }, [xaiPrecision, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(getK('oracle_active'), JSON.stringify(oracleActive));
    }
  }, [oracleActive, userId]);

  const updateSliderMax = (key, newMax) => {
    setSliderSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        max: Number(newMax)
      }
    }));
  };

  return (
    <SettingsContext.Provider value={{
      sliderSettings,
      updateSliderMax,
      xaiPrecision,
      setXaiPrecision,
      oracleActive,
      setOracleActive
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
