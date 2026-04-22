import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthorId, setEditAuthorId] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, authorsRes] = await Promise.all([
        api.get('/books'),
        api.get('/authors')
      ]);
      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setEditTitle(book.title);
    setEditAuthorId(book.authorId || '');
    setErrors({});
    setIsEditOpen(true);
  };

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setIsDeleteOpen(true);
  };

  const handleUpdate = async () => {
    const newErrors = {};
    if (!editTitle.trim()) newErrors.title = 'Title is required';
    if (!editAuthorId) newErrors.author = 'Author is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.put(`/books/${selectedBook.id}`, { 
        title: editTitle,
        authorId: parseInt(editAuthorId)
      });
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      setErrors({ global: 'Failed to update book' });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/books/${selectedBook.id}`);
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      alert('Error deleting book.');
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
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.id}>
              <td>{index + 1}</td>
              <td style={{ fontWeight: 500 }}>{book.title}</td>
              <td>{book.authorName}</td>
              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEditClick(book)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteClick(book)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No books found.</td>
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
        title="Edit Book"
        footer={(
          <>
            <button className="btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleUpdate}>Save Changes</button>
          </>
        )}
      >
        <div className="form-group">
          <label>Book Title</label>
          <input 
            type="text" 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Enter book title"
          />
          {errors.title && <p className="error-msg">{errors.title}</p>}
        </div>
        <div className="form-group">
          <label>Author</label>
          <select 
            value={editAuthorId} 
            onChange={(e) => setEditAuthorId(e.target.value)}
          >
            <option value="">Select author</option>
            {authors.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          {errors.author && <p className="error-msg">{errors.author}</p>}
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
            <button className="btn-danger" onClick={handleDeleteConfirm}>Delete Book</button>
          </>
        )}
      >
        <p>Are you sure you want to delete book <b>{selectedBook?.title}</b>?</p>
        <p style={{ marginTop: '10px', color: '#ef4444', fontSize: '13px' }}>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default BookList;
