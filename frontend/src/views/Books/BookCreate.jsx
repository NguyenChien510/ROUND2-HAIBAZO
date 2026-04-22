import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookCreate = () => {
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [authors, setAuthors] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/authors');
        setAuthors(response.data);
      } catch (err) {
        console.error('Error fetching authors:', err);
      }
    };
    fetchAuthors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Please enter name';
    if (!authorId) newErrors.author = 'Please select author';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/books', { 
        title, 
        authorId: parseInt(authorId) 
      });
      navigate('/books');
    } catch (err) {
      setErrors({ global: 'Error creating book.' });
    }
  };

  return (
    <div className="card" style={{ padding: '40px', maxWidth: '600px' }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setErrors({...errors, title: ''});
            }} 
            placeholder="Enter book title"
            style={{ borderColor: errors.title ? '#ef4444' : '#e2e8f0' }}
          />
          {errors.title && <div className="error-msg">* {errors.title} . . . . . . . . . . . . . . . . . . . . .</div>}
        </div>

        <div className="form-group">
          <label>Author</label>
          <select 
            value={authorId} 
            onChange={(e) => {
              setAuthorId(e.target.value);
              if (e.target.value) setErrors({...errors, author: ''});
            }}
            style={{ borderColor: errors.author ? '#ef4444' : '#e2e8f0' }}
          >
            <option value="">Select an author</option>
            {authors.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          {errors.author && <div className="error-msg">* {errors.author} . . . . . . . . . . . . . . . . . . . . .</div>}
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <button type="submit" className="btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
};

export default BookCreate;
