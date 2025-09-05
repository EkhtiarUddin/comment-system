import React from 'react';
import Comment from './Comment';
import '../styles/CommentList.scss';

const CommentList = ({ comments, onUpdate, onDelete, onReplyAdded }) => {
  if (!comments || comments.length === 0) {
    return <div className="no-comments">No comments yet. Be the first to comment!</div>;
  }

  return (
    <div className="comment-list">
      {comments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReplyAdded={onReplyAdded}
          depth={0}
        />
      ))}
    </div>
  );
};

export default CommentList;
