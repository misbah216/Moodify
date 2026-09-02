import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
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