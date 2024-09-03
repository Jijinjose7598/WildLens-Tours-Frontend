import  { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faBank } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

const Payment = () => {
  
  const { user } = useContext(AuthContext); 
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [upiMethod, setUpiMethod] = useState(''); 
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [reenterBankAccountNumber, setReenterBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();

  const handlePaymentMethodClick = (method) => {
    setPaymentMethod(method);
    if (method !== 'UPI') {
      setUpiMethod(''); 
    }
  };

  const handleUpiMethodClick = (method) => {
    setUpiMethod(method);
    setPaymentMethod('UPI'); 
  };

  const handleInputChange = (type, value) => {
    switch (type) {
      case 'cardNumber':
        setCardNumber(value);
        break;
      case 'expiryDate':
        setExpiryDate(value);
        break;
      case 'cvv':
        setCvv(value);
        break;
      case 'cardHolderName':
        setCardHolderName(value);
        break;
      case 'bankAccountNumber':
        setBankAccountNumber(value);
        break;
      case 'reenterBankAccountNumber':
        setReenterBankAccountNumber(value);
        break;
      case 'ifscCode':
        setIfscCode(value);
        break;
      case 'upiId':
        setUpiId(value);
        break;
      default:
        break;
    }
  };

  const handlePayment = async () => {
    try {
      const paymentData = {
        user: user._id,
        amount: 1000, 
        paymentDate: new Date().toISOString(),
        status: 'pending',
        method: paymentMethod.toLowerCase().replace(' ', '_'),
      
      };

      const paymentResponse = await axios.post('https://wildlens-tours-backend-tqh1.onrender.com/api/payments/create', paymentData);
      const paymentId = paymentResponse.data.paymentId; 

      if (!paymentId) {
        throw new Error('Payment ID is not defined');
      }

      const statusUpdateResponse = await axios.put(`https://wildlens-tours-backend-tqh1.onrender.com/api/payments/update-status/${paymentId}`);
      console.log('Payment status updated:', statusUpdateResponse.data);

      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error processing payment:', error.response || error.message);
      alert('There was an error processing your payment.');
    }
  };

  const handleBackToHome = () => {
    setShowSuccessPopup(false);
    navigate('/home');
  };

  return (
    <div className="payment-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100%',
      margin: 0,
      backgroundImage: "url('https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcT8dj1YVsGUU-PMEpMMhiJtXrn0NhoXOAsNVDORyV-Id2s7Zan4KLeV3pFVFyqtvy9e0upoP0qkYIGd0w1Lt1Np6l3HMGo8fvyh2D8tlg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="payment-wrapper" style={{ 
        display: 'flex',
        width: '80%',
        maxWidth: '1200px'
      }}>
        <div className="payment-card" style={{ 
          flex: 2,
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h2>Payment Methods</h2>
          <div className="payment-icons" style={{ 
            display: 'flex', 
            justifyContent: 'space-around',
            width: '100%',
            margin: '20px 0'
          }}>
            <FontAwesomeIcon 
              icon={faCreditCard} 
              style={{ fontSize: '50px', color: '#000', cursor: 'pointer' }} 
              onClick={() => handlePaymentMethodClick('Credit Card')}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png"
              alt="UPI"
              style={{ 
                width: '50px', 
                height: '50px', 
                objectFit: 'contain', 
                marginLeft: '10px', 
                marginRight: '10px', 
                cursor: 'pointer' 
              }}
              onClick={() => handlePaymentMethodClick('UPI')}
            />
            <FontAwesomeIcon 
              icon={faBank} 
              style={{ fontSize: '50px', color: '#003087', cursor: 'pointer' }} 
              onClick={() => handlePaymentMethodClick('Bank Transfer')}
            />
            <FontAwesomeIcon 
              icon={faPaypal} 
              style={{ fontSize: '50px', color: '#003087', cursor: 'pointer' }} 
              onClick={() => handlePaymentMethodClick('PayPal')}
            />
          </div>
          {/* Payment form sections */}
          {paymentMethod === 'Credit Card' && (
            <div>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  className="form-control"
                  value={cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="form-group">
                <label htmlFor="expiryDate">Expiration Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  className="form-control"
                  value={expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  className="form-control"
                  value={cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="***"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardHolderName">Card Holder's Name</label>
                <input
                  type="text"
                  id="cardHolderName"
                  className="form-control"
                  value={cardHolderName}
                  onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <button onClick={handlePayment} className="btn btn-primary mt-3">Confirm Payment</button>
            </div>
          )}
          {paymentMethod === 'UPI' && (
            <div>
              <div className="form-group">
                <label>Choose UPI Method</label>
                <div className="upi-icons" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  width: '100%',
                  margin: '20px 0'
                }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Google_Pay_Logo_%282020%29.svg/2048px-Google_Pay_Logo_%282020%29.svg.png"
                    alt="Google Pay"
                    style={{ width: '80px', height: '50px', cursor: 'pointer' }}
                    onClick={() => handleUpiMethodClick('Google Pay')}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/PhonePe_Logo.svg/2560px-PhonePe_Logo.svg.png"
                    alt="PhonePe"
                    style={{ width: '80px', height: '50px', cursor: 'pointer' }}
                    onClick={() => handleUpiMethodClick('PhonePe')}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/BHIM-Logo.svg/2048px-BHIM-Logo.svg.png"
                    alt="BHIM"
                    style={{ width: '80px', height: '50px', cursor: 'pointer' }}
                    onClick={() => handleUpiMethodClick('BHIM')}
                  />
                </div>
              </div>
              {upiMethod && (
                <div className="form-group">
                  <label htmlFor="upiId">UPI ID</label>
                  <input
                    type="text"
                    id="upiId"
                    className="form-control"
                    value={upiId}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                    placeholder="example@upi"
                  />
                </div>
              )}
              <button onClick={handlePayment} className="btn btn-primary mt-3">Confirm Payment</button>
            </div>
          )}
          {paymentMethod === 'Bank Transfer' && (
            <div>
              <div className="form-group">
                <label htmlFor="bankAccountNumber">Bank Account Number</label>
                <input
                  type="text"
                  id="bankAccountNumber"
                  className="form-control"
                  value={bankAccountNumber}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                  placeholder="123456789012"
                />
              </div>
              <div className="form-group">
                <label htmlFor="reenterBankAccountNumber">Re-enter Bank Account Number</label>
                <input
                  type="text"
                  id="reenterBankAccountNumber"
                  className="form-control"
                  value={reenterBankAccountNumber}
                  onChange={(e) => handleInputChange('reenterBankAccountNumber', e.target.value)}
                  placeholder="123456789012"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ifscCode">IFSC Code</label>
                <input
                  type="text"
                  id="ifscCode"
                  className="form-control"
                  value={ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  placeholder="ABCD0123456"
                />
              </div>
              <button onClick={handlePayment} className="btn btn-primary mt-3">Confirm Payment</button>
            </div>
          )}
          {paymentMethod === 'PayPal' && (
            <div>
              <p>Redirecting to PayPal...</p>
            </div>
          )}
        </div>

        {showSuccessPopup && (
          <div className="success-popup" style={{ 
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            <FaCheckCircle style={{ color: 'green', fontSize: '40px' }} />
            <h3>Payment Successful</h3>
            <button onClick={handleBackToHome} className="btn btn-primary mt-3">Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
