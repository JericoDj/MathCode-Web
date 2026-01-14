import React, { useState, useEffect, useRef, useContext } from "react";
import "./PackageDialog.css";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { PackageContext } from '../../context/PackageContext';

export default function PackageDialog({ package: pkg, onClose }) {
  const fileInputRef = useRef(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending_payment');
  const [showPaymentOptions, setShowPaymentOptions] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingPayment, setHasExistingPayment] = useState(false);

  const { fetchAllPackages } = useContext(PackageContext);



  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";


  // Safe package data
  const safePackage = pkg || {};




  // Check for existing payment data when package changes
  useEffect(() => {
    if (safePackage.payment || safePackage.paymentProof) {
      setHasExistingPayment(true);
      setPaymentStatus('submitted');
      console.log(paymentStatus);

      // If there's existing payment, show the upload section
      if (safePackage.payment?.method === 'bank-transfer') {
        setShowPaymentOptions(true);
        setSelectedPaymentMethod('bank-transfer');
      }
    } else {
      setHasExistingPayment(false);
      setPaymentStatus('pending_payment');
    }
  }, [safePackage]);

  // Close dialog on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not scheduled';
    try {


      
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      const formattedTime = timeString || date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${formattedDate} at ${formattedTime}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleJoin = () => {
    if (safePackage.meetingLink) {
      window.open(safePackage.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Delete old file from Firebase Storage
  const deleteOldFileFromFirebase = async (fileName) => {
    if (!fileName) return;

    try {
      console.log('Attempting to delete old file:', fileName);

      // If the fileName doesn't include the folder path, add it
      let fullPath = fileName;
      if (!fileName.startsWith('payment_proofs/')) {
        fullPath = `payment_proofs/${fileName}`;
      }

      const oldFileRef = ref(storage, fullPath);

      // Try to delete the file
      await deleteObject(oldFileRef);
      console.log('Old file deleted successfully:', fullPath);
      return true;
    } catch (error) {
      // If file doesn't exist (404), that's fine - just log it
      if (error.code === 'storage/object-not-found') {
        console.log('File already deleted or never existed:', fileName);
      } else {
        console.warn('Could not delete old file:', error.message, error.code);
      }
      return false;
    }
  };

  // Handle file selection (for both Choose File and Change File)
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max) - DO THIS FIRST
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size too large. Please upload a file smaller than 5MB.');
      return;
    }

    // Validate file type - DO THIS SECOND
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid file type (JPEG, PNG, JPG, PDF).');
      return;
    }

    // Set the file immediately for UI feedback
    setPaymentProof(file);
    setPaymentStatus('processing');
  };

  // Upload file to Firebase Storage
  const uploadToFirebaseStorage = async (file, packageId) => {
    try {
      console.log('Starting Firebase upload for file:', file.name);

      // Create a unique filename
      const fileExtension = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `payment_proofs/${packageId}_${timestamp}.${fileExtension}`;

      // Create a storage reference
      const storageRef = ref(storage, fileName);

      // Upload the file
      console.log('Uploading to Firebase Storage...');
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Upload completed:', snapshot);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);

      return {
        downloadURL,
        fileName: snapshot.ref.name,
        fileSize: snapshot.metadata.size,
        fileType: snapshot.metadata.contentType
      };
    } catch (error) {
      console.error('Error uploading to Firebase:', error);
      throw new Error(`Failed to upload payment proof: ${error.message}`);
    }
  };

  // Submit payment to backend API
  const submitPaymentToAPI = async (packageId, paymentData) => {

    try {

      console.log('Submitting payment data to API for package:', packageId);
      console.log(paymentData);
      const token = JSON.parse(localStorage.getItem('token'));

      const response = await fetch(`${API_BASE_URL}/api/packages/${packageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod: 'bank-transfer',
          paymentProof: paymentData.downloadURL,
          paymentFileName: paymentData.fileName,
          paymentFileSize: paymentData.fileSize,
          paymentFileType: paymentData.fileType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting payment to API:', error);
      throw error;
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentProof || !safePackage._id) {
      alert('Please select a payment proof file');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. DELETE OLD FILE FIRST (if exists)
      let oldFileDeleted = false;
      if (hasExistingPayment && safePackage.payment?.fileName) {
        console.log('Deleting old file before upload:', safePackage.payment.fileName);
        oldFileDeleted = await deleteOldFileFromFirebase(safePackage.payment.fileName);
      }

      // 2. Upload new file to Firebase Storage
      const uploadResult = await uploadToFirebaseStorage(paymentProof, safePackage._id);

      // 3. Submit payment data to backend API
      const paymentData = {
        paymentMethod: 'bank-transfer',
        ...uploadResult
      };

      await submitPaymentToAPI(safePackage._id, paymentData);

      // 4. Update local state
      setPaymentStatus('completed');
      setShowPaymentOptions(false);
      setHasExistingPayment(true);

      // alert('Payment proof updated successfully!');

      await fetchAllPackages?.();


      // Close dialog after successful submission
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Error submitting payment:', error);
      alert(`Error: ${error.message}`);
      setPaymentStatus('processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'bank-transfer') {
      setShowPaymentOptions(true);
    } else {
      handleOnlinePayment(method);
    }
  };

  const handleOnlinePayment = (method) => {
    console.log(`Redirecting to ${method} payment gateway`);
    alert(`Redirecting to ${method} payment gateway...`);
  };

  const handleViewExistingFile = () => {
    if (safePackage.payment?.proof || safePackage.paymentProof) {
      const fileUrl = safePackage.payment?.proof || safePackage.paymentProof;
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('File input not found');
      alert('File upload not available. Please try again.');
    }
  };

  const copyPackageId = () => {
    if (safePackage._id) {
      navigator.clipboard.writeText(safePackage._id);
      alert('Package ID copied to clipboard!');
    } else {
      alert('No package ID available');
    }
  };

  // Status checks
  const packageStatus = safePackage.status?.toLowerCase() || 'unknown';
  const canJoin = packageStatus === 'scheduled' && safePackage.meetingLink;
  const canUploadPayment = packageStatus === 'pending_payment' || packageStatus === 'under_review';
  const showPaymentDetailsOnly =
    packageStatus === 'approved' ||
    packageStatus === 'scheduled' ||
    packageStatus === 'completed' ||
    packageStatus === 'no-show' ||
    packageStatus === 'cancelled';
  const canChat = packageStatus === 'pending_payment' || packageStatus === 'scheduled' || packageStatus === 'requested_assessment';
  const canReschedule = packageStatus === 'scheduled';

  // Backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!pkg) return null;

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className="dialog-box package-dialog">
        <div className="dialog-header">
          <h2>Package Details</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="dialog-content">
          {/* Package ID with copy button */}
          <div className="package-id-section">
            <label>Package ID</label>
            <div className="package-id-copy">
              <code>{safePackage._id || 'No ID available'}</code>
              {safePackage._id && (
                <button className="btn-copy" onClick={copyPackageId}>📋 Copy</button>
              )}
            </div>
          </div>



          {/* Package Type Information */}
          {safePackage.packageType && (
            <div className="package-type-section">
              <div className="detail-row">
                <span className="detail-label">Package Type</span>
                <span className="detail-value">{safePackage.packageType === '1-1' ? '1:1 Private Tutoring' : '1:2 Small Group'}</span>
              </div>
              {safePackage.sessionsPerWeek && (
                <div className="detail-row">
                  <span className="detail-label">Sessions Per Week</span>
                  <span className="detail-value">{safePackage.sessionsPerWeek}</span>
                </div>
              )}
              {safePackage.totalSessions && (
                <div className="detail-row">
                  <span className="detail-label">Total Sessions</span>
                  <span className="detail-value">{safePackage.totalSessions}</span>
                </div>
              )}
              {safePackage.remainingSessions && (
                <div className="detail-row">
                  <span className="detail-label">Remaining Sessions</span>
                  <span className="detail-value">{safePackage.remainingSessions}</span>
                </div>
              )}
            </div>
          )}

          {/* Details List */}
          <div className="details-list">
            <div className="detail-row">
              <span className="detail-label">Student Name</span>
              <span className="detail-value">
                {safePackage.child?.firstName && safePackage.child?.lastName
                  ? `${safePackage.child.firstName} ${safePackage.child.lastName}`
                  : 'Not specified'}
              </span>
            </div>

            {safePackage.tutorName && (
              <div className="detail-row">
                <span className="detail-label">Tutor</span>
                <span className="detail-value">{safePackage.tutorName}</span>
              </div>
            )}
            {safePackage.tutorId && (
              <div className="detail-row">
                <span className="detail-label">Tutor ID</span>
                <span className="detail-value">{safePackage.tutorId}</span>
              </div>
            )}

            {/* Student / Child Info */}
            {safePackage.child && (
              <>
                {safePackage.child.school && (
                  <div className="detail-row">
                    <span className="detail-label">School</span>
                    <span className="detail-value">{safePackage.child.school}</span>
                  </div>
                )}

                {safePackage.child.age && (
                  <div className="detail-row">
                    <span className="detail-label">Age</span>
                    <span className="detail-value">{safePackage.child.age}</span>
                  </div>
                )}


              </>
            )}
            {safePackage.childId && (
              <div className="detail-row">
                <span className="detail-label">Child ID</span>
                <span className="detail-value">{safePackage.childId}</span>
              </div>
            )}
            {safePackage.preferredDate && (
              <div className="detail-row">
                <span className="detail-label">Date & Time</span>
                <span className="detail-value">{formatDateTime(safePackage.preferredDate, safePackage.preferredTime)}</span>
              </div>
            )}
            {safePackage.timezone && (
              <div className="detail-row">
                <span className="detail-label">Timezone</span>
                <span className="detail-value">{safePackage.timezone}</span>
              </div>
            )}



            {safePackage.duration && (
              <div className="detail-row">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{safePackage.duration} minutes</span>
              </div>
            )}
            {safePackage.price && (
              <div className="detail-row">
                <span className="detail-label">Price</span>
                <span className="detail-value">${safePackage.price}</span>
              </div>
            )}
            {safePackage.meetingLink && packageStatus !== 'completed' && (
              <div className="detail-row">
                <span className="detail-label">Meeting Link</span>
                <span className="detail-value">
                  <a href={safePackage.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                    Click to join meeting
                  </a>
                  <p>
                    {safePackage.meetingLink}

                  </p>
                </span>
              </div>
            )}
            {safePackage.notes && (
              <div className="detail-row">
                <span className="detail-label">Notes</span>
                <span className="detail-value">{safePackage.notes}</span>
              </div>
            )}
          </div>

          {/* Payment Section */}
          {/* Payment Section */}
          {canUploadPayment && (
            <div className="payment-section">
              <div className="payment-header">
                <h4>Payment Option</h4>
                <p>Choose your preferred payment method</p>

                <div className="payment-methods">

                  <button
                    className="payment-method-btn"
                    onClick={() => hasExistingPayment && (safePackage.payment || safePackage.paymentProof)
                      ? null
                      : handlePaymentMethodSelect('card')
                    }
                    disabled={hasExistingPayment && (safePackage.payment || safePackage.paymentProof)}
                  >
                    <div className="payment-method-icon">💳</div>
                    <div className="payment-method-info">
                      <h5>Credit/Debit Card</h5>
                      <p>Pay securely with your card</p>
                    </div>
                    <div className="payment-arrow">→</div>
                  </button>

                  {/* <button
                    className="payment-method-btn"
                    onClick={() => hasExistingPayment && (safePackage.payment || safePackage.paymentProof)
                      ? null
                      : handlePaymentMethodSelect('paypal')
                    }
                    disabled={hasExistingPayment && (safePackage.payment || safePackage.paymentProof)}
                  >
                    <div className="payment-method-icon">💰</div>
                    <div className="payment-method-info">
                      <h5>PayPal</h5>
                      <p>Pay with your PayPal account</p>
                    </div>
                    <div className="payment-arrow">→</div>
                  </button> */}

                  <button
                    className="payment-method-btn"
                    onClick={() => handlePaymentMethodSelect('bank-transfer')}
                  >
                    <div className="payment-method-icon">📱</div>
                    <div className="payment-method-info">
                      <h5>QR Payment / Bank Transfer</h5>
                      <p>Gcash / Maya / GrabPay / Bank Transfer</p>
                    </div>
                    <div className="payment-arrow">→</div>
                  </button>

                </div>

              </div>

              {/* QR / Bank Transfer Upload Section */}
              {showPaymentOptions && (
                <div className="bank-transfer-section">

                  {/* Existing Payment Information */}
                  {hasExistingPayment && (safePackage.payment || safePackage.paymentProof) && (
                    <div className="existing-payment-info">
                      <h5>📋 Existing Payment Submission</h5>

                      <div className="existing-payment-details">
                        <div className="payment-detail">
                          <strong>Method:</strong> {safePackage.payment?.method || safePackage.paymentMethod}
                        </div>
                        <div className="payment-detail">
                          <strong>File:</strong> {safePackage.payment?.fileName || 'Payment Proof'}
                        </div>
                        <div className="payment-detail">
                          <strong>Submitted:</strong> {formatDate(safePackage.payment?.submittedAt || safePackage.paymentSubmittedAt)}
                        </div>
                        <div className="payment-detail">
                          <strong>Status:</strong>
                          <span className={`payment-status-badge ${safePackage.payment?.status || 'submitted'}`}>
                            {safePackage.payment?.status || 'submitted'}
                          </span>
                        </div>
                      </div>

                      <div className="payment-actions-column">
                        <button className="payment-btn-view" onClick={handleViewExistingFile}>
                          View File
                        </button>

                        <button
                          className={`payment-btn-change ${(safePackage.payment?.method || safePackage.paymentMethod) !== 'bank-transfer' ? 'disabled' : ''}`}
                          onClick={(safePackage.payment?.method || safePackage.paymentMethod) === 'bank-transfer' ? triggerFileInput : null}
                          disabled={(safePackage.payment?.method || safePackage.paymentMethod) !== 'bank-transfer'}
                        >
                          Change File
                        </button>
                      </div>

                      {paymentProof && (
                        <div className="selected-file-info">
                          <div className="selected-file-header">
                            <span className="selected-file-icon">📄</span>
                            <strong>New File Selected:</strong>
                          </div>
                          <div className="selected-file-details">
                            <span className="file-name">{paymentProof.name}</span>
                            <span className="file-size">({formatFileSize(paymentProof.size)})</span>
                          </div>
                          <div className="file-type-badge">
                            {paymentProof.type === 'application/pdf' ? 'PDF' : 'Image'}
                          </div>
                        </div>
                      )}

                      <div className="payment-note">
                        <p>💡 Your payment is under review. You can upload a new file if needed.</p>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Instructions */}
                  <div className="payment-instructions">
                    <h5>Bank Transfer & QR Payment Instructions</h5>
                    <div className="payment-details">
                      <div className="bank-detail">
                        <strong>Bank Name:</strong> GoTyme Bank
                      </div>
                      <div className="bank-detail">
                        <strong>Account Name:</strong> Jerico De Jesus
                      </div>
                      <div className="bank-detail">
                        <strong>Account Number:</strong> 0166 6085 9420
                      </div>
                      <div className="bank-detail">
                        <strong>Amount:</strong> ${safePackage.price || '0.00'}
                      </div>
                    </div>

                    <div className="payment-details">
                      <div className="bank-detail">
                        <strong>Bank Name:</strong> GCASH
                      </div>
                      <div className="bank-detail">
                        <strong>Account Name:</strong> Jerico De Jesus
                      </div>
                      <div className="bank-detail">
                        <strong>Account Number:</strong> 0976 041 3260
                      </div>
                      <div className="bank-detail">
                        <strong>Amount:</strong> ${safePackage.price || '0.00'}
                      </div>
                    </div>

                    <div className="payment-details">
                      <div className="bank-detail">
                        <strong>Bank Name:</strong> MAYA
                      </div>
                      <div className="bank-detail">
                        <strong>Account Name:</strong> Genevieve Baldevarona
                      </div>
                      <div className="bank-detail">
                        <strong>Account Number:</strong> 0908 228 9971
                      </div>
                      <div className="bank-detail">
                        <strong>Amount:</strong> ${safePackage.price || '0.00'}
                      </div>
                    </div>
                    <p className="instruction-note">
                      After making the payment, please upload your proof of payment below.
                    </p>
                  </div>

                  {/* File Upload Section */}
                  <div className="payment-upload">
                    <label>Upload Proof of Payment</label>

                    <div className="upload-controls">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        disabled={isSubmitting}
                      />

                      <button
                        type="button"
                        className={`payment-upload-btn ${isSubmitting ? 'disabled' : ''}`}
                        onClick={triggerFileInput}
                        disabled={isSubmitting}
                      >
                        📎 Choose File
                      </button>
                      {paymentProof && !hasExistingPayment && (
                        <span className="file-name">{paymentProof.name}</span>
                      )}
                    </div>
                    <p className="upload-hint">
                      Upload screenshot or PDF of your payment confirmation (Max: 5MB)
                    </p>
                  </div>

                  <div className="pay-actions">
                    <button
                      className="pay-btn-back"
                      onClick={() => {
                        setShowPaymentOptions(false);
                        setPaymentProof(null);
                      }}
                      disabled={isSubmitting}
                    >
                      ← Back to Payment Methods
                    </button>

                    <button
                      className="pay-btn-primary"
                      onClick={handleSubmitPayment}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : hasExistingPayment ? 'Update Payment Proof' : 'Submit Payment Proof'}
                    </button>
                  </div>

                  {isSubmitting && (
                    <div className="upload-progress">
                      <div className="progress-text">
                        {hasExistingPayment ? 'Replacing payment proof...' : 'Uploading payment proof...'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* 🟣 PAYMENT DETAILS ONLY (NO ACTIONS)  */}
          {showPaymentDetailsOnly && hasExistingPayment && (
            <div className="payment-section">
              <div className="payment-header">
                <h4>Payment Details</h4>
                <p>This payment is already submitted and processed.</p>
              </div>

              <div className="existing-payment-info">
                <h5>📋 Payment Information</h5>

                <div className="existing-payment-details">
                  <div className="payment-detail">
                    <strong>Method:</strong> {safePackage.payment?.method || safePackage.paymentMethod}
                  </div>
                  <div className="payment-detail">
                    <strong>File:</strong> {safePackage.payment?.fileName || 'Payment Proof'}
                  </div>
                  <div className="payment-detail">
                    <strong>Submitted:</strong> {formatDate(safePackage.payment?.submittedAt || safePackage.paymentSubmittedAt)}
                  </div>
                  <div className="payment-detail">
                    <strong>Status:</strong>
                    <span className={`payment-status-badge ${safePackage.payment?.status || 'submitted'}`}>
                      {'Submitted'}
                    </span>
                  </div>
                </div>

                <button className="payment-btn-view" onClick={handleViewExistingFile}>
                  View File
                </button>
              </div>
            </div>
          )}


          {/* Footer Actions */}
          <div className="dialog-actions">
            {canJoin && <button className="btn-primary" onClick={handleJoin}>🚀 Join Session</button>}
            {canChat && <button className="btn-outline">💬 Chat with Tutor</button>}
            {canReschedule && <button className="btn-outline">📅 Reschedule</button>}
              {/* {(packageStatus === 'pending_payment' || packageStatus === 'requested_assessment') && (
                <button className="btn-danger">Cancel Request</button>
              )} */}
            <button className="btn-secondary ms-auto" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}