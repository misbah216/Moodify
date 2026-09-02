import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getNotes } from '../service/notes.api';
import '../style/home.css';

function SavedNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getNotes()
      .then((data) => setNotes(data.notes || []))
      .catch(() => setError('Unable to load your notes.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="saved-notes-page">
      <div className="saved-notes-header">
        <button type="button" className="saved-notes-back" onClick={() => navigate('/home')}>
          Back to Moodify
        </button>
        <h1>Saved Notes</h1>
      </div>
      {loading && <p className="saved-notes-message">Loading notes...</p>}
      {error && <p className="saved-notes-message">{error}</p>}
      {!loading && !error && notes.length === 0 && (
        <p className="saved-notes-message">You have not saved any notes yet.</p>
      )}
      <div className="saved-notes-list">
        {notes.map((note) => (
          <article className="saved-note" key={note._id}>
            <p>{note.content}</p>
            <time dateTime={note.createdAt}>
              {new Date(note.createdAt).toLocaleString()}
            </time>
          </article>
        ))}
      </div>
    </main>
  );
}

export default SavedNotes;