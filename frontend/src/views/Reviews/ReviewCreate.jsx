import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ReviewCreate = () => {
  const [content, setContent] = useState('');
  const [bookId, setBookId] = useState('');
  const [books, setBooks] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!content.trim()) newErrors.content = 'Please enter review content';
    if (!bookId) newErrors.book = 'Please select a book';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post('/reviews', { 
        content, 
        bookId: parseInt(bookId) 
      });
      navigate('/reviews');
    } catch (err) {
      setErrors({ global: 'Error creating review.' });
    }
  };

  return (
    <div className="card" style={{ padding: '40px', maxWidth: '600px' }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book</label>
          <select 
            value={bookId} 
            onChange={(e) => {
              setBookId(e.target.value);
              if (e.target.value) setErrors({...errors, book: ''});
            }}
            style={{ borderColor: errors.book ? '#ef4444' : '#e2e8f0' }}
          >
            <option value="">Select a book</option>
            {books.map(b => (
              <option key={b.id} value={b.id}>{b.title} ({b.authorName})</option>
            ))}
          </select>
          {errors.book && <div className="error-msg">* {errors.book} . . . . . . . . . . . . . . . . . . . . .</div>}
        </div>

        <div className="form-group">
          <label>Review</label>
          <textarea 
            rows="5"
            value={content} 
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value.trim()) setErrors({...errors, content: ''});
            }} 
            placeholder="Enter your review here..."
            style={{ 
              width: '100%', 
              padding: '10px 15px', 
              border: `1px solid ${errors.content ? '#ef4444' : '#e2e8f0'}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
          {errors.content && <div className="error-msg">* {errors.content} . . . . . . . . . . . . . . . . . . . . .</div>}
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <button type="submit" className="btn-primary">Create Review</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewCreate;
