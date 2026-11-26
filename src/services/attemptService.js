import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_ATTEMPT_API_BASE_URL || "http://localhost:8080/api";

const attemptApi = axios.create({
  baseURL: API_BASE_URL,
});

attemptApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Start a new mock test attempt
export const startAttempt = async (attemptData) => {
  const response = await attemptApi.post("/attempt/start", attemptData);
  return response.data;
};

// Fetch active attempt for a specific test
export const getActiveAttempt = async (userId, testType, sourceName) => {
  const response = await attemptApi.get(`/attempt/active/${userId}`, {
    params: {
      testType,
      sourceName,
    },
  });

  // Backend returns 204 when no active attempt exists.
  return response.status === 204 ? null : response.data;
};

// Save or update an answer
export const saveAnswer = async (attemptId, answerData) => {
  const response = await attemptApi.put(
    `/attempt/${attemptId}/answer`,
    answerData
  );
  return response.data;
};

// Fetch previously saved answers
export const getSavedAnswers = async (attemptId) => {
  const response = await attemptApi.get(`/attempt/${attemptId}/answers`);
  return response.data;
};

// Submit the mock test
export const submitAttempt = async (attemptData) => {
  const response = await attemptApi.post("/attempt/submit", attemptData);
  return response.data;
};

// Get attempt result
export const getAttemptResult = async (attemptId) => {
  const response = await attemptApi.get(`/attempt/${attemptId}/result`);
  return response.data;
};

export const getMockTestStatuses = async (userId) => {
  const response = await attemptApi.get(`/attempt/mock-status/${userId}`);
  return response.data;
};