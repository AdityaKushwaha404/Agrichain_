import React, { useState } from 'react';
import { createTransferPayment, verifyTransferPayment } from '../api';

function TransferForm() {
  const [form, setForm] = useState({ batchId: '', to: '', noteCID: '', amount: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => new Promise((resolve) => {
    const existing = document.getElementById('razorpay-js');
    if (existing) return resolve(true);
    const s = document.createElement('script');
    s.id = 'razorpay-js';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const friendlyError = (raw) => {
    const msg = typeof raw === 'string' ? raw : (raw?.message || '');
    const lower = msg.toLowerCase();
    if (lower.includes('insufficient payment')) return 'Transfer failed: insufficient payment amount.';
    if (lower.includes('user rejected') || lower.includes('rejected')) return 'Payment was cancelled.';
    if (lower.includes('network') || lower.includes('rpc')) return 'Network error. Please try again in a moment.';
    return 'Transfer failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      // 1) Create order on server
      const { data } = await createTransferPayment({
        amount: form.amount,
        batchId: form.batchId,
        to: form.to,
        noteCID: form.noteCID,
      });

      // 2) Load Razorpay and open checkout
      const ok = await loadRazorpay();
      if (!ok) throw new Error('Failed to load Razorpay SDK');

      const options = {
        key: data.keyId,
        currency: data.currency || 'INR',
        amount: data.amount, // in paise
        order_id: data.orderId,
        name: 'AgriChain',
        description: `Ownership transfer for ${form.batchId}`,
        prefill: {},
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            const verifyRes = await verifyTransferPayment(verifyPayload);
            setResult({ success: true, txHash: verifyRes.data.txHash });
          } catch (ve) {
            const raw = ve?.response?.data?.error || ve?.message || ve;
            console.error('Transfer verify error:', ve);
            setResult({ error: friendlyError(raw) });
          }
        },
        modal: {
          ondismiss: function () {
            setResult({ error: 'Payment was cancelled.' });
          }
        },
        theme: { color: '#10b981' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const raw = err?.response?.data?.error || err?.message || err;
      console.error('Transfer init error:', err);
      setResult({ error: friendlyError(raw) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="form-section-title">Transfer Ownership</h3>
      <form onSubmit={handleSubmit} className="form-grid gap-4">
        <div className="form-field">
          <label className="form-label">Batch ID</label>
          <input className="form-input" name="batchId" placeholder="Batch ID" value={form.batchId} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label">Amount (INR)</label>
          <input className="form-input" name="amount" type="number" min="1" step="0.01" placeholder="e.g. 499.00" value={form.amount} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label">Recipient Address</label>
          <input className="form-input" name="to" placeholder="0x..." value={form.to} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label className="form-label">Note CID (optional)</label>
          <input className="form-input" name="noteCID" placeholder="Optional IPFS CID" value={form.noteCID} onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="submit" className="form-button" disabled={loading}>{loading ? 'Processing…' : 'Pay & Transfer'}</button>
        </div>
      </form>
      {result && (
        <div className="mt-3">
          {result.error ? (
            <span className="result-error">
              {result.error}
            </span>
          ) : (
            <span className="result-success">Success • Tx: {result.txHash}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default TransferForm;
