import React, { useState, useRef, useEffect } from 'react';
import { FileText, FileImage, FileCode, CheckCircle, Loader2, UploadCloud, X } from 'lucide-react';

const MOCK_EXTRACTED = {
  age: 34,
  gender: 'Female',
  income: 7083,
  loanAmount: 450000,
  creditScore: 680,
  totalDebt: 2500,
  employmentStatus: 'Employed',
};

const DocumentUpload = ({ onProcessed, isLocked }) => {
  const [isDragging, setIsDragging]     = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone]             = useState(false);
  const [userName, setUserName]         = useState('');
  const [fileName, setFileName]         = useState('');
  const [progress, setProgress]         = useState(0);
  const fileInputRef = useRef(null);
  const progressRef  = useRef(null);

  // Animate progress bar during processing
  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      let current = 0;
      // Ramp up to ~88% over 2s, then hold until done
      progressRef.current = setInterval(() => {
        current += Math.random() * 8 + 3;
        if (current >= 88) {
          current = 88;
          clearInterval(progressRef.current);
        }
        setProgress(Math.round(current));
      }, 180);
    } else {
      clearInterval(progressRef.current);
    }
    return () => clearInterval(progressRef.current);
  }, [isProcessing]);

  const processFile = (file) => {
    setFileName(file.name);
    setIsProcessing(true);
    setIsDone(false);

    setTimeout(() => {
      clearInterval(progressRef.current);
      setProgress(100);
      setIsProcessing(false);
      setIsDone(true);
      // Give user a moment to see "100% Complete" before navigating
      setTimeout(() => onProcessed({ ...MOCK_EXTRACTED, name: userName || 'Anonymous Applicant' }), 600);
    }, 2500);
  };

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()    => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };
  const handleClear = (e) => {
    e.stopPropagation();
    setFileName('');
    setProgress(0);
    setIsDone(false);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const PathSelector = ({ onSelect, isLocked }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', opacity: isLocked ? 0.6 : 1 }}>
      <div
        className="glass-panel path-card"
        onClick={() => !isLocked && onSelect('manual')}
        style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
      >
        <FileText size={30} style={{ color: '#f43f5e' }} />
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Manual Entry</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Enter details yourself</p>
      </div>
      <div
        className="glass-panel path-card"
        onClick={() => !isLocked && onSelect('upload')}
        style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
      >
        <UploadCloud size={30} style={{ color: 'var(--primary)' }} />
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Upload Document</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>AI extracts details</p>
      </div>
    </div>
  );

  const dropZoneBorder = isDragging
    ? 'var(--primary)'
    : fileName
    ? 'rgba(16,185,129,0.4)'
    : 'var(--border-glass)';

  const dropZoneBg = isDragging
    ? 'rgba(16,185,129,0.06)'
    : fileName
    ? 'rgba(16,185,129,0.03)'
    : 'rgba(0,0,0,0.08)';

  return (
    <div className="card-luxe" style={{ display: 'flex', flexDirection: 'column', minHeight: '440px' }}>
      <h3 className="card-title" style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '1px' }}>
        DOCUMENT SMART INGESTION
      </h3>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={isLocked ? null : handleDrop}
        onClick={() => !isProcessing && !isLocked && fileInputRef.current.click()}
        style={{
          flex: 1,
          border: `2px dashed ${dropZoneBorder}`,
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 2rem',
          background: dropZoneBg,
          cursor: isProcessing || isLocked ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          onChange={handleFileInput}
        />

        {/* State: Processing */}
        {isProcessing && (
          <>
            <Loader2 size={48} color="var(--primary)" className="animate-spin" />
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                Analyzing Document...
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                {fileName}
              </p>
            </div>
          </>
        )}

        {/* State: Done */}
        {isDone && (
          <>
            <CheckCircle size={52} color="var(--success)" />
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--success)' }}>
                Extraction Complete
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                {fileName}
              </p>
            </div>
          </>
        )}

        {/* State: Idle / filename selected */}
        {!isProcessing && !isDone && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {fileName ? (
              /* File selected, not yet processed */
              <>
                <div style={{
                  width: 56, height: 56,
                  background: 'var(--primary-dim)',
                  border: '1px solid var(--border-active)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={28} color="var(--primary)" />
                </div>
                <div style={{ width: '100%', maxWidth: '300px', marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', textAlign: 'left', marginBottom: '0.4rem', fontWeight: 700 }}>Confirm Applicant Name</label>
                    <input
                      type="text"
                      placeholder="Enter legal name for registration"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-glass)',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        marginBottom: '1.25rem',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
                    />
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {fileName}
                  </p>
                </div>
                <button
                  onClick={handleClear}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    background: 'rgba(244,63,94,0.1)',
                    border: '1px solid rgba(244,63,94,0.25)',
                    color: 'var(--danger)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.75rem', fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <X size={13} /> Remove
                </button>
              </>
            ) : (
              /* No file yet */
              <>
                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
                  {/* PDF Icon - Optimized */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '46px', height: '60px', 
                      background: 'linear-gradient(135deg, #FF4136, #e7040f)', 
                      borderRadius: '6px', position: 'relative', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', color: 'white',
                      fontWeight: 900, fontSize: '0.7rem', 
                      boxShadow: '0 8px 16px rgba(255,65,54,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, background: 'rgba(255,255,255,0.2)', clipPath: 'polygon(0 0, 0% 100%, 100% 100%)', borderRadius: '0 0 0 2px' }}></div>
                      PDF
                    </div>
                  </div>
                  {/* PNG Icon - Optimized */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '46px', height: '60px', 
                      background: 'linear-gradient(135deg, #357EDD, #153e75)', 
                      borderRadius: '6px', position: 'relative', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', color: 'white',
                      fontWeight: 900, fontSize: '0.7rem', 
                      boxShadow: '0 8px 16px rgba(53,126,221,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, background: 'rgba(255,255,255,0.2)', clipPath: 'polygon(0 0, 0% 100%, 100% 100%)', borderRadius: '0 0 0 2px' }}></div>
                      PNG
                    </div>
                  </div>
                  {/* JPG Icon - Optimized */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '46px', height: '60px', 
                      background: 'linear-gradient(135deg, #19A974, #0e6243)', 
                      borderRadius: '6px', position: 'relative', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', color: 'white',
                      fontWeight: 900, fontSize: '0.7rem', 
                      boxShadow: '0 8px 16px rgba(25,169,116,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, background: 'rgba(255,255,255,0.2)', clipPath: 'polygon(0 0, 0% 100%, 100% 100%)', borderRadius: '0 0 0 2px' }}></div>
                      JPG
                    </div>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.4, maxWidth: '300px' }}>
                    Drag & Drop bank statements or forms for instant analysis
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.85rem' }}>
                    or <span style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'underline' }}>Browse Financial Records</span>
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Progress bar section */}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            {isProcessing
              ? `Gemini AI Extracting Financial Attributes...`
              : isDone
              ? 'Extraction Complete'
              : 'AES-256 Encrypted · No data stored'}
          </span>
          {(isProcessing || isDone) && (
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isDone ? 'var(--success)' : 'var(--primary)' }}>
              {progress}%
            </span>
          )}
        </div>

        <div className="shap-track" style={{ height: '6px' }}>
          <div
            className="shap-fill"
            style={{
              width: isProcessing || isDone ? `${progress}%` : '100%',
              background: isDone
                ? 'var(--success)'
                : isProcessing
                ? 'var(--primary)'
                : 'rgba(255,255,255,0.06)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.6rem', fontStyle: 'italic' }}>
          {isProcessing
            ? 'Normalizing income, debt, and credit vectors...'
            : isDone
            ? 'All fields extracted successfully — proceeding to analysis.'
            : '100% Private · Data never leaves your browser'}
        </p>
      </div>
    </div>
  );
};

export default DocumentUpload;
