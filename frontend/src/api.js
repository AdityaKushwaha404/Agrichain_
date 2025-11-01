import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export const createBatch = async (data) => {
  return axios.post(`${API_BASE}/blockchain/createBatch`, data);
};

export const getBatch = async (batchId) => {
  return axios.get(`${API_BASE}/blockchain/batch/${batchId}`);
};

export const recordTransfer = async (data) => {
  return axios.post(`${API_BASE}/blockchain/actions/transfer`, data);
};

export const recordArrival = async (data) => {
  return axios.post(`${API_BASE}/blockchain/actions/arrival`, data);
};

export const postPrice = async (data) => {
  return axios.post(`${API_BASE}/blockchain/actions/price`, data);
};

export const buyBatch = async (data) => {
  return axios.post(`${API_BASE}/blockchain/actions/buy`, data);
};

export const recordQuality = async (data) => {
  return axios.post(`${API_BASE}/blockchain/actions/quality`, data);
};

// --- AI Copilot ---
export const aiChat = async ({ messages, batchId, txHash, token }) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await axios.post(
    `${API_BASE}/ai/chat`,
    { messages, batchId, txHash },
    { headers }
  );
  return data;
};

// --- Transfers with payment (Razorpay) ---
export const createTransferPayment = async ({ amount, batchId, to, noteCID }) => {
  return axios.post(`${API_BASE}/transfer/create-payment`, { amount, batchId, to, noteCID });
};

export const verifyTransferPayment = async (payload) => {
  return axios.post(`${API_BASE}/transfer/verify`, payload);
};
