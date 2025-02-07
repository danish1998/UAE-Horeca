// PaymentForm.js
import React, { useEffect, useState } from 'react';

const SquareApp = () => {
    const [payments, setPayments] = useState(null);
    const [cardPayment, setCardPayment] = useState(null);
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');

    // These should be stored in your environment variables
    const appId = "sandbox-sq0idb-IqV1FtANybjWOdQu4Sfavg"
    const locationId = "LYC7DVTNG32EC"

    useEffect(() => {
        initializeSquare();
        return () => {
            // Cleanup card payment instance
            if (cardPayment) {
                cardPayment.destroy();
            }
        };
    }, []);

    async function initializeSquare() {
        if (!window.Square) {
            throw new Error('Square.js failed to load properly');
        }

        try {
            const paymentsInstance = await window.Square.payments(appId, locationId);
            setPayments(paymentsInstance);

            const card = await paymentsInstance.card();
            await card.attach('#card-container');
            setCardPayment(card);
            setStatus('ready');
        } catch (e) {
            console.error('Failed to initialize Square:', e);
            setStatus('error');
            setErrorMessage('Failed to load payment system');
        }
    }

    async function handlePaymentSubmit() {
       
        setStatus('processing');
        setErrorMessage('');

        if (!cardPayment) {
            setErrorMessage('Payment system not initialized');
            setStatus('error');
            return;
        }

        try {
            const result = await cardPayment.tokenize();
            if (result.status === 'OK') {
                // Process payment through your backend
                const response = await fetch('https://admin.thehorecastore.co/api/payment-square', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sourceId: result.token,
                        "nonce": "cnon:card-nonce-ok",
                        "amount": 50,
                        "currency": "USD",
                        "customer_id": "12",
                        "location_id": locationId,
                        "team_member_id": "TMSyzQc-dIlWMlZe",
                        "buyer_email_address": "abc@gmail.com"


                        // sourceId: result.token,
                        // amount: 1000, // Amount in cents (e.g., $10.00)
                        // currency: 'USD',
                        // locationId: locationId,

                    }),
                });

                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setErrorMessage(data.error || 'Payment failed');
                }
            } else {
                setStatus('error');
                setErrorMessage(result.errors[0].message);
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
            setErrorMessage('Payment processing failed');
        }
    }

    return (
        <div className="payment-form">
            
                <div id="card-container" style={{ minHeight: '100px', border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}></div>

                <button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={status !== 'ready'}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '20px',
                        backgroundColor: status !== 'ready' ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: status !== 'ready' ? 'not-allowed' : 'pointer'
                    }}
                >
                    {status === 'processing' ? 'Processing...' : 'Pay Now'}
                </button>

                {errorMessage && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        {errorMessage}
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ color: 'green', marginTop: '10px' }}>
                        Payment successful!
                    </div>
                )}
          
        </div>
    );
};

export default SquareApp;