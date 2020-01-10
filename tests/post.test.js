import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  deletePost,
  createPost,
  updatePost,
  getMyPost,
  getPosts
} from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('should expose public posts only', async () => {
  const response = await client.query({
    query: getPosts
  });
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test('should fetch users posts', async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({
    query: getMyPost
  });

  expect(data.myPosts.length).toBe(2);
});

test('should be able to update own post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: `${postOne.post.id}`,
    data: {
      published: false
    }
  };

  const { data } = await client.mutate({
    mutation: updatePost,
    variables
  });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  });
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test('should create a new Post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: {
      title: 'Automatic createPost',
      body: 'some green blue gems in the river',
      published: true
    }
  };
  const { data } = await client.mutate({
    mutation: createPost,
    variables
  });

  const exists = await prisma.exists.Post({
    id: data.createPost.id,
    title: data.createPost.title,
    published: data.createPost.published
  });

  expect(exists).toBe(true);
});

test('should delete the second post', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: `${postTwo.post.id}`
  };

  const { data } = await client.mutate({
    mutation: deletePost,
    variables
  });

  const exists = await prisma.exists.Post({
    id: data.deletePost.id,
    title: data.deletePost.title,
    published: data.deletePost.published
  });

  expect(exists).toBe(false);
});
