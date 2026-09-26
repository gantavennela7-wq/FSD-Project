import React, { useRef } from 'react';
import { X, Printer, Download, Award, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';

const CertificateModal = ({ isOpen, onClose, studentName, courseTitle, completionDate, certificateId }) => {
  const certificateRef = useRef(null);

  if (!isOpen) return null;

  const formattedDate = completionDate 
    ? new Date(completionDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const certId = certificateId || `EV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Triggers standard print-to-PDF flow seamlessly
    window.print();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={styles.modalHeader} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="#B87333" />
            <h3 style={{ margin: 0, color: '#3D291F', fontSize: '1.2rem', fontWeight: '700' }}>
              Course Certificate of Completion
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={styles.closeBtn}
            aria-label="Close"
          >
            <X size={20} color="#78716C" />
          </button>
        </div>

        {/* Certificate Card Printable Area */}
        <div className="certificate-print-wrapper" style={styles.certWrapper}>
          <div ref={certificateRef} style={styles.certificateCard} className="eduvibe-certificate">
            {/* Ornate Inner Border */}
            <div style={styles.innerBorder}>
              
              {/* Certificate Top Header */}
              <div style={styles.certHeader}>
                <div style={styles.logoBadge}>
                  <Award size={36} color="#B87333" />
                </div>
                <h1 style={styles.mainHeading}>CERTIFICATE</h1>
                <h3 style={styles.subHeading}>OF COMPLETION</h3>
                <div style={styles.dividerLine}></div>
              </div>

              {/* Certificate Body */}
              <div style={styles.certBody}>
                <p style={styles.certText}>This is to certify that</p>
                <h2 style={styles.recipientName}>{studentName || 'Student Name'}</h2>
                <p style={styles.certText}>has successfully completed the comprehensive course</p>
                <h3 style={styles.courseName}>{courseTitle || 'Course Title'}</h3>
                
                <div style={styles.completionBadge}>
                  <CheckCircle size={16} color="#059669" />
                  <span>Course Completion: 100%</span>
                </div>
              </div>

              {/* Certificate Footer */}
              <div style={styles.certFooter}>
                <div style={styles.footerCol}>
                  <div style={styles.signLine}></div>
                  <span style={styles.signLabel}>EduVibe LMS</span>
                  <span style={styles.signSub}>Academic Director</span>
                </div>

                <div style={styles.sealCol}>
                  <div style={styles.seal}>
                    <ShieldCheck size={28} color="#B87333" />
                    <span style={styles.sealText}>VERIFIED</span>
                  </div>
                </div>

                <div style={styles.footerCol}>
                  <div style={styles.dateVal}>{formattedDate}</div>
                  <div style={styles.signLine}></div>
                  <span style={styles.signLabel}>Date of Issue</span>
                  <span style={styles.certIdText}>ID: {certId}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div style={styles.modalFooter} className="no-print">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1.25rem' }}
          >
            Close
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              onClick={handlePrint} 
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem' }}
            >
              <Printer size={16} /> Print Certificate
            </button>
            <button 
              type="button" 
              onClick={handleDownload} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem' }}
            >
              <Download size={16} /> Download Certificate
            </button>
          </div>
        </div>

      </div>

      {/* Embedded Print CSS to format clean full-page landscape certificate printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .eduvibe-certificate, .eduvibe-certificate * {
            visibility: visible !important;
          }
          .no-print {
            display: none !important;
          }
          .certificate-print-wrapper {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            background: #FFFFFF !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .eduvibe-certificate {
            width: 100% !important;
            max-width: 900px !important;
            box-shadow: none !important;
            border: 8px double #B87333 !important;
            background-color: #FAF8F5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 25, 23, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
    backdropFilter: 'blur(4px)'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '850px',
    width: '100%',
    maxHeight: '92vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid #E7E5E4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  certWrapper: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#F5F2EC'
  },
  certificateCard: {
    backgroundColor: '#FAF8F5',
    border: '6px double #B87333',
    borderRadius: '8px',
    padding: '16px',
    width: '100%',
    boxShadow: '0 8px 30px rgba(61, 41, 31, 0.12)',
    boxSizing: 'border-box'
  },
  innerBorder: {
    border: '1.5px solid #D7CCC8',
    padding: '32px 28px',
    borderRadius: '4px',
    textAlign: 'center',
    position: 'relative',
    background: 'radial-gradient(circle at center, #FFFFFF 0%, #FAF8F5 100%)'
  },
  certHeader: {
    marginBottom: '20px'
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#F3EFEA',
    border: '2px solid #B87333',
    marginBottom: '10px'
  },
  mainHeading: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2rem',
    fontWeight: '800',
    color: '#3D291F',
    letterSpacing: '4px',
    margin: '4px 0 0 0'
  },
  subHeading: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#B87333',
    letterSpacing: '3px',
    margin: '2px 0 12px 0'
  },
  dividerLine: {
    width: '120px',
    height: '2px',
    backgroundColor: '#B87333',
    margin: '0 auto'
  },
  certBody: {
    margin: '20px 0 32px 0'
  },
  certText: {
    fontSize: '0.95rem',
    color: '#78716C',
    fontStyle: 'italic',
    margin: '8px 0'
  },
  recipientName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.1rem',
    fontWeight: '700',
    color: '#1C1917',
    margin: '10px 0',
    borderBottom: '2px solid #E7E5E4',
    display: 'inline-block',
    paddingBottom: '4px',
    minWidth: '280px'
  },
  courseName: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#3D291F',
    margin: '10px 0 14px 0'
  },
  completionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ECFDF5',
    color: '#065F46',
    border: '1px solid #A7F3D0',
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  certFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '28px',
    paddingTop: '16px',
    borderTop: '1px dashed #D7CCC8'
  },
  footerCol: {
    flex: 1,
    textAlign: 'center'
  },
  signLine: {
    width: '140px',
    height: '1px',
    backgroundColor: '#3D291F',
    margin: '0 auto 6px auto'
  },
  signLabel: {
    display: 'block',
    fontWeight: '700',
    fontSize: '0.85rem',
    color: '#3D291F'
  },
  signSub: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#78716C'
  },
  sealCol: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  seal: {
    width: '74px',
    height: '74px',
    borderRadius: '50%',
    border: '2px dashed #B87333',
    backgroundColor: '#FAF8F5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(184, 115, 51, 0.15)'
  },
  sealText: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#B87333',
    letterSpacing: '1px',
    marginTop: '2px'
  },
  dateVal: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1C1917',
    marginBottom: '4px'
  },
  certIdText: {
    display: 'block',
    fontSize: '0.7rem',
    color: '#A8A29E',
    marginTop: '2px'
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #E7E5E4',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px'
  }
};

export default CertificateModal;
