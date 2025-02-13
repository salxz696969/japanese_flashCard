// frontend/src/api.js
const API_URL = 'http://localhost:5000';

// Fetch lesson data from the API
export const fetchLesson = (lessonId) => {
  return fetch(`${API_URL}/lessons/${lessonId}`).then(res => res.json());
};

// Get the words to remember
export const getRememberList = () => {
  return fetch(`${API_URL}/remember`).then(res => res.json());
};

// Add a word to the remember list
export const addToRememberList = (word) => {
  return fetch(`${API_URL}/remember`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word),
  }).then(res => res.json());
};
