const prisma = require('../utils/prisma');

const CommentController = {
  async getAllComments(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || 'newest';
      const skip = (page - 1) * limit;

      let orderBy = {};
      switch(sort) {
        case 'most_liked':
          orderBy = { reactions: { _count: 'desc' } };
          break;
        case 'most_disliked':
          // This requires a more complex query
          orderBy = { createdAt: 'desc' };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }

      const where = { parentId: null };

      const [comments, totalCount] = await Promise.all([
        prisma.comment.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            user: {
              select: { username: true }
            },
            reactions: true,
            replies: {
              include: {
                user: {
                  select: { username: true }
                },
                reactions: true
              },
              orderBy: { createdAt: 'asc' }
            },
            _count: {
              select: {
                reactions: true,
                replies: true
              }
            }
          }
        }),
        prisma.comment.count({ where })
      ]);

      // Calculate likes and dislikes for each comment
      const commentsWithReactions = comments.map(comment => {
        const likes = comment.reactions.filter(r => r.reactionType === 'like').length;
        const dislikes = comment.reactions.filter(r => r.reactionType === 'dislike').length;
        
        return {
          ...comment,
          likes,
          dislikes
        };
      });

      res.json({
        comments: commentsWithReactions,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
  },

  async createComment(req, res) {
    try {
      const { content, parentId } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: 'Comment content is required' });
      }
      
      const comment = await prisma.comment.create({
        data: {
          content,
          userId: req.user.id,
          parentId: parentId || null
        },
        include: {
          user: {
            select: { username: true }
          },
          reactions: true
        }
      });
      
      res.status(201).json({
        ...comment,
        likes: 0,
        dislikes: 0
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
  },

  async updateComment(req, res) {
    try {
      const commentId = parseInt(req.params.id);
      const { content } = req.body;
      
      // Verify user owns the comment
      const existingComment = await prisma.comment.findUnique({
        where: { id: commentId }
      });
      
      if (!existingComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      
      if (existingComment.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this comment' });
      }
      
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
        include: {
          user: {
            select: { username: true }
          },
          reactions: true
        }
      });
      
      const likes = updatedComment.reactions.filter(r => r.reactionType === 'like').length;
      const dislikes = updatedComment.reactions.filter(r => r.reactionType === 'dislike').length;
      
      res.json({
        ...updatedComment,
        likes,
        dislikes
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
  },

  async deleteComment(req, res) {
    try {
      const commentId = parseInt(req.params.id);
      
      // Verify user owns the comment
      const existingComment = await prisma.comment.findUnique({
        where: { id: commentId }
      });
      
      if (!existingComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      
      if (existingComment.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this comment' });
      }
      
      await prisma.comment.delete({
        where: { id: commentId }
      });
      
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
  },

  async addReaction(req, res) {
    try {
      const commentId = parseInt(req.params.id);
      const userId = req.user.id;
      const { reactionType } = req.body;
      
      if (!['like', 'dislike'].includes(reactionType)) {
        return res.status(400).json({ message: 'Invalid reaction type' });
      }
      
      // Check if reaction already exists
      const existingReaction = await prisma.commentReaction.findUnique({
        where: {
          commentId_userId: {
            commentId,
            userId
          }
        }
      });
      
      let reaction;
      if (existingReaction) {
        // Update existing reaction
        reaction = await prisma.commentReaction.update({
          where: {
            commentId_userId: {
              commentId,
              userId
            }
          },
          data: { reactionType }
        });
      } else {
        // Create new reaction
        reaction = await prisma.commentReaction.create({
          data: {
            commentId,
            userId,
            reactionType
          }
        });
      }
      
      // Get updated counts
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          reactions: true
        }
      });
      
      const likes = comment.reactions.filter(r => r.reactionType === 'like').length;
      const dislikes = comment.reactions.filter(r => r.reactionType === 'dislike').length;
      
      res.json({
        message: 'Reaction added successfully',
        reaction,
        likes,
        dislikes
      });
    } catch (error) {
      res.status(500).json({ message: 'Error adding reaction', error: error.message });
    }
  },

  async removeReaction(req, res) {
    try {
      const commentId = parseInt(req.params.id);
      const userId = req.user.id;
      
      await prisma.commentReaction.delete({
        where: {
          commentId_userId: {
            commentId,
            userId
          }
        }
      });
      
      // Get updated counts
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          reactions: true
        }
      });
      
      const likes = comment.reactions.filter(r => r.reactionType === 'like').length;
      const dislikes = comment.reactions.filter(r => r.reactionType === 'dislike').length;
      
      res.json({
        message: 'Reaction removed successfully',
        likes,
        dislikes
      });
    } catch (error) {
      res.status(500).json({ message: 'Error removing reaction', error: error.message });
    }
  },

  async getUserReaction(req, res) {
    try {
      const commentId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const reaction = await prisma.commentReaction.findUnique({
        where: {
          commentId_userId: {
            commentId,
            userId
          }
        }
      });
      
      res.json({
        reactionType: reaction ? reaction.reactionType : null
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user reaction', error: error.message });
    }
  }
};

module.exports = CommentController;
