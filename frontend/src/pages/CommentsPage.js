import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import '../styles/CommentsPage.scss';

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Use useCallback to memoize the function
  const fetchComments = useCallback(async (page = 1, sort = sortBy) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/comments?page=${page}&limit=10&sort=${sort}`);
      setComments(response.data.comments);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setError('');
    } catch (error) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentAdded = () => {
    fetchComments(currentPage, sortBy);
  };

  const handleCommentUpdated = (commentId, newContent) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, content: newContent }
          : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchComments(newPage, sortBy);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    fetchComments(1, newSort);
  };

  if (isLoading && currentPage === 1) {
    return <div className="loading">Loading comments...</div>;
  }

  return (
    <div className="comments-page">
      <div className="comments-header">
        <h1>Comments</h1>
        <div className="comments-controls">
          <div className="sort-options">
            <span>Sort by: </span>
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="most_liked">Most Liked</option>
              <option value="most_disliked">Most Disliked</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <CommentForm onCommentAdded={handleCommentAdded} />
      
      <CommentList
        comments={comments}
        onUpdate={handleCommentUpdated}
        onDelete={handleCommentDeleted}
        onReply={handleCommentAdded}
      />

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span>Page {currentPage} of {totalPages}</span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
