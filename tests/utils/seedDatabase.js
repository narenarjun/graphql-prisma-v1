import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
  input: {
    name: 'deepika',
    email: 'deepika@mail.com',
    password: bcrypt.hashSync('fluffypanda123')
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: 'alia',
    email: 'alia@mail.com',
    password: bcrypt.hashSync('Chubbybear890')
  },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: 'My published post',
    body: '  ',
    published: true
  },
  post: undefined
};
const postTwo = {
  input: {
    title: 'My draft post',
    body: '  ',
    published: false
  },
  post: undefined
};

const commentByUserOne = {
  input: {
    text: 'this a comment is by user ONE'
  },
  comment: undefined
};

const commentByUserTwo = {
  input: {
    text: 'this a comment is by user TWO'
  },
  comment: undefined
};

const seedDatabase = async () => {
  //? Delete test data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyComments();

  //? Create user One
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  //? Create user two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  //! Create post One
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
  //! Create post two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });

  //!Create comment by UserOne
  commentByUserOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentByUserOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  });

  //!Create comment by UserTwo
  commentByUserTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentByUserTwo.input,
      author: {
        connect: {
          id: userTwo.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  });
};

export {
  seedDatabase as default,
  userOne,
  postOne,
  postTwo,
  userTwo,
  commentByUserOne,
  commentByUserTwo
};
