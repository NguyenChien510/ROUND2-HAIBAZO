import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthorCreate = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter name');
      return;
    }

    try {
      await api.post('/authors', { name });
      navigate('/authors');
    } catch (err) {
      setError('Error creating author. Please try again.');
    }
  };

  return (
    <div className="card" style={{ padding: '40px', maxWidth: '600px' }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setError('');
            }} 
            placeholder="Enter author name"
            style={{ borderColor: error ? '#ef4444' : '#e2e8f0' }}
          />
          {error && <div className="error-msg">* {error} . . . . . . . . . . . . . . . . . . . . .</div>}
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <button type="submit" className="btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
};

export default AuthorCreate;
