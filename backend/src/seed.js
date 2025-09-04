const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // USERS
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        username: 'user1',
        email: 'user1@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        username: 'user2',
        email: 'user2@example.com',
        password: hashedPassword,
      },
    }),
  ]);

  console.log('Created users:', users.map(u => u.username));

  // COMMENTS
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'This is a great comment system.',
        userId: users[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I love this post.',
        userId: users[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Let’s DM.',
        userId: users[2].id,
      },
    }),
  ]);

  console.log('Created comments:', comments.length);

  // REPLIES
  const replies = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Thanks for the feedback.',
        userId: users[0].id,
        parentId: comments[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I agree with you.',
        userId: users[2].id,
        parentId: comments[1].id,
      },
    }),
  ]);

  console.log('Created replies:', replies.length);

  // EACTIONS
  const reactions = await Promise.all([
    prisma.commentReaction.create({
      data: {
        commentId: comments[0].id,
        userId: users[1].id,
        reactionType: 'like',
      },
    }),
    prisma.commentReaction.create({
      data: {
        commentId: comments[0].id,
        userId: users[2].id,
        reactionType: 'like',
      },
    }),
    prisma.commentReaction.create({
      data: {
        commentId: comments[1].id,
        userId: users[0].id,
        reactionType: 'dislike',
      },
    }),
  ]);

  console.log('Created reactions:', reactions.length);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
