import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${selectedReview.id}`);
      setIsDeleteOpen(false);
      fetchReviews();
    } catch (error) {
      alert('Error deleting review.');
      setIsDeleteOpen(false);
    }
  };

  if (loading) return <div style={{padding: '20px'}}>Loading...</div>;

  return (
    <div className="card">
      <table className="review-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Book</th>
            <th>Author</th>
            <th>Review</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review.id}>
              <td>{index + 1}</td>
              <td style={{ fontWeight: 500 }}>{review.bookTitle}</td>
              <td>{review.authorName}</td>
              <td style={{ color: '#0369a1' }}>{review.content}</td>
              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleDeleteClick(review)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No reviews found.</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Delete"
        footer={(
          <>
            <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
            <button className="btn-danger" onClick={handleDeleteConfirm}>Delete Review</button>
          </>
        )}
      >
        <p>Are you sure you want to delete this review for <b>{selectedReview?.bookTitle}</b>?</p>
        <p style={{ marginTop: '10px', color: '#ef4444', fontSize: '13px' }}>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default ReviewList;
