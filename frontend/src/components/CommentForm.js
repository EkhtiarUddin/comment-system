import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/CommentForm.scss';

const CommentForm = ({ parentId = null, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await api.post('/comments', { content, parent_id: parentId });
      setContent('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-form-auth-required">
        Please log in to leave a comment.
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write your reply..." : "Write your comment..."}
        rows="4"
        required
      />
      <button 
        type="submit" 
        disabled={isSubmitting || !content.trim()}
      >
        {isSubmitting ? 'Posting...' : (parentId ? 'Post Reply' : 'Post Comment')}
      </button>
    </form>
  );
};

export default CommentForm;
