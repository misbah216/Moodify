import axios from 'axios';

const api = axios.create({
  baseURL: 'https://moodify-g77y.onrender.com',
  withCredentials: true,
});

export async function saveNote(content) {
  const response = await api.post('/api/notes', { content });
  return response.data;
}

export async function getNotes() {
  const response = await api.get('/api/notes');
  return response.data;
}