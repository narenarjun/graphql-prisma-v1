import bcrypt from 'bcryptjs';
import getuserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);
    // ! leaving the info returns back all the scalar types from prisma, so it'll help to deal with custom schema on the nodejs side
    const user = await prisma.mutation.createUser({
      data: { ...args.data, password }
    });

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async loginUser(parent, args, { prisma }, info) {
    const user = await prisma.query.users({
      where: {
        email: args.data.emailID
      }
    });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(args.data.password, user[0].password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return {
      user: user[0],
      token: generateToken(user[0].id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);
    return await prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);
    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }
    return await prisma.mutation.updateUser(
      {
        data: args.data,
        where: {
          id: userId
        }
      },
      info
    );
  },
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);
    return await prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error('Unable to delete post');
    }

    return await prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });
    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    });

    if (!postExists) {
      throw new Error('Unable to update post');
    }

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: { id: args.id }
        }
      });
    }

    return await prisma.mutation.updatePost(
      {
        data: args.data,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);

    const postExists = await prisma.exists.Post({
      id: args.data.postID,
      published: true
    });
    if (!postExists) {
      throw new Error('Unable to find post');
    }
    return await prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.postID
            }
          }
        }
      },
      info
    );
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error('Unabel to delete comment');
    }
    return await prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error('Unabel to update comment');
    }
    return await prisma.mutation.updateComment(
      {
        data: {
          text: args.data.text
        },
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

export { Mutation as default };
