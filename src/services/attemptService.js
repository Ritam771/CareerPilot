
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// Start a new mock test attempt
export const startAttempt = async (attemptData) => {
    const response = await axios.post(
        `${API_BASE_URL}/attempt/start`,
        attemptData
    );

    return response.data;
};

// Fetch active attempt for a specific test
export const getActiveAttempt = async (
    userId,
    testType,
    sourceName
) => {
    const response = await axios.get(
        `${API_BASE_URL}/attempt/active/${userId}`,
        {
            params: {
                testType,
                sourceName
            }
        }
    );

    // Backend returns 204 when no active attempt exists.
    return response.status === 204 ? null : response.data;
};

// Save or update an answer
export const saveAnswer = async (attemptId, answerData) => {
    const response = await axios.put(
        `${API_BASE_URL}/attempt/${attemptId}/answer`,
        answerData
    );

    return response.data;
};

// Fetch previously saved answers
export const getSavedAnswers = async (attemptId) => {
    const response = await axios.get(
        `${API_BASE_URL}/attempt/${attemptId}/answers`
    );

    return response.data;
};

// Submit the mock test
export const submitAttempt = async (attemptData) => {
    const response = await axios.post(
        `${API_BASE_URL}/attempt/submit`,
        attemptData
    );

    return response.data;
};

//get attempt-result..
export const getAttemptResult = async (attemptId) => {
    const response = await axios.get(
        `${API_BASE_URL}/attempt/${attemptId}/result`
    );

    return response.data;
};

export const getMockTestStatuses = async (userId) => {
    const response = await axios.get(
        `${API_BASE_URL}/attempt/mock-status/${userId}`
    );

    return response.data;
};
