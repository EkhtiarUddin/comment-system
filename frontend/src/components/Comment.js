import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Comment.scss';

const Comment = ({ comment, onUpdate, onDelete, onReply }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [userReaction, setUserReaction] = useState(null);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(comment.dislikes || 0);

  useEffect(() => {
    const fetchUserReaction = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get(`/comments/${comment.id}/reaction`);
          setUserReaction(response.data.reactionType);
        } catch (error) {
          console.error('Error fetching user reaction:', error);
        }
      }
    };
    
    fetchUserReaction();
  }, [comment.id, isAuthenticated]);

  const handleEdit = async () => {
    try {
      await api.put(`/comments/${comment.id}`, { content: editedContent });
      onUpdate(comment.id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${comment.id}`);
        onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleReply = async () => {
    try {
      await api.post('/comments', { content: replyContent, parent_id: comment.id });
      setReplyContent('');
      setIsReplying(false);
      onReply();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleReaction = async (reactionType) => {
    if (!isAuthenticated) return;
    
    try {
      // If user already has this reaction, remove it
      if (userReaction === reactionType) {
        await api.delete(`/comments/${comment.id}/reaction`);
        setUserReaction(null);
        
        if (reactionType === 'like') {
          setLikesCount(likesCount - 1);
        } else {
          setDislikesCount(dislikesCount - 1);
        }
      } 
      // If user has the opposite reaction, change it
      else if (userReaction && userReaction !== reactionType) {
        await api.post(`/comments/${comment.id}/reaction`, { reactionType });
        setUserReaction(reactionType);
        
        if (reactionType === 'like') {
          setLikesCount(likesCount + 1);
          setDislikesCount(dislikesCount - 1);
        } else {
          setLikesCount(likesCount - 1);
          setDislikesCount(dislikesCount + 1);
        }
      }
      // If user has no reaction, add it
      else {
        await api.post(`/comments/${comment.id}/reaction`, { reactionType });
        setUserReaction(reactionType);
        
        if (reactionType === 'like') {
          setLikesCount(likesCount + 1);
        } else {
          setDislikesCount(dislikesCount + 1);
        }
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const isOwner = currentUser && currentUser.id === comment.userId;

  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">{comment.user.username}</span>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      
      {isEditing ? (
        <div className="comment-edit">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="3"
          />
          <div className="comment-edit-actions">
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}
      
      <div className="comment-actions">
        <div className="comment-reactions">
          <button 
            className={`reaction-btn ${userReaction === 'like' ? 'active' : ''}`}
            onClick={() => handleReaction('like')}
            disabled={!isAuthenticated}
          >
            👍 {likesCount}
          </button>
          <button 
            className={`reaction-btn ${userReaction === 'dislike' ? 'active' : ''}`}
            onClick={() => handleReaction('dislike')}
            disabled={!isAuthenticated}
          >
            👎 {dislikesCount}
          </button>
        </div>
        
        {isAuthenticated && (
          <button 
            className="reply-btn"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </button>
        )}
        
        {isOwner && (
          <>
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              Edit
            </button>
            <button 
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </div>
      
      {isReplying && (
        <div className="comment-reply">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            rows="3"
          />
          <div className="comment-reply-actions">
            <button onClick={handleReply}>Post Reply</button>
            <button onClick={() => setIsReplying(false)}>Cancel</button>
          </div>
        </div>
      )}
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
