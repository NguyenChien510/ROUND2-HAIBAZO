import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (author) => {
    setSelectedAuthor(author);
    setEditName(author.name);
    setError('');
    setIsEditOpen(true);
  };

  const handleDeleteClick = (author) => {
    setSelectedAuthor(author);
    setIsDeleteOpen(true);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      setError('Name is required');
      return;
    }
    try {
      await api.put(`/authors/${selectedAuthor.id}`, { name: editName });
      setIsEditOpen(false);
      fetchAuthors();
    } catch (err) {
      setError('Failed to update author');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/authors/${selectedAuthor.id}`);
      setIsDeleteOpen(false);
      fetchAuthors();
    } catch (error) {
      alert('Error deleting author. They might have existing books.');
      setIsDeleteOpen(false);
    }
  };

  if (loading) return <div style={{padding: '20px'}}>Loading...</div>;

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Books</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author, index) => (
            <tr key={author.id}>
              <td>{index + 1}</td>
              <td style={{ fontWeight: 500 }}>{author.name}</td>
              <td>{author.bookCount}</td>
              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEditClick(author)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteClick(author)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {authors.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No authors found.</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        title="Edit Author"
        footer={(
          <>
            <button className="btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleUpdate}>Save Changes</button>
          </>
        )}
      >
        <div className="form-group">
          <label>Author Name</label>
          <input 
            type="text" 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter author name"
            autoFocus
          />
          {error && <p className="error-msg">{error}</p>}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Delete"
        footer={(
          <>
            <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
            <button className="btn-danger" onClick={handleDeleteConfirm}>Delete Author</button>
          </>
        )}
      >
        <p>Are you sure you want to delete author <b>{selectedAuthor?.name}</b>?</p>
        <p style={{ marginTop: '10px', color: '#ef4444', fontSize: '13px' }}>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AuthorList;
