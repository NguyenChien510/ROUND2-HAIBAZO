import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthorList from './views/Authors/AuthorList';
import AuthorCreate from './views/Authors/AuthorCreate';
import BookList from './views/Books/BookList';
import BookCreate from './views/Books/BookCreate';
import ReviewList from './views/Reviews/ReviewList';
import ReviewCreate from './views/Reviews/ReviewCreate';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Authors > List');

  return (
    <Router>
      <div className="app-container">
        <Sidebar onPageChange={setCurrentPage} />
        
        <div className="main-area">
          <Header title="HAIBAZO BOOK REVIEW" />
          
          <div className="breadcrumb">
            {currentPage}
          </div>

          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/authors" />} />
              <Route path="/authors" element={<AuthorList />} />
              <Route path="/authors/create" element={<AuthorCreate />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/create" element={<BookCreate />} />
              <Route path="/reviews" element={<ReviewList />} />
              <Route path="/reviews/create" element={<ReviewCreate />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
