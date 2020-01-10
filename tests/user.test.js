import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne, userTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, getUsers, getProfile, login } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('should create a new user', async () => {
  const variables = {
    data: {
      name: 'urvashi',
      email: 'urvashi@exmaple.com',
      password: 'Cutepanda123'
    }
  };

  const response = await client.mutate({
    mutation: createUser,
    variables
  });

  const isExists = await prisma.exists.User({
    id: response.data.createUser.user.id
  });

  expect(isExists).toBe(true);
});

test('should expose public author profiles', async () => {
  const response = await client.query({
    query: getUsers
  });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('deepika');
});

test('should not login with bad credentials', async () => {
  const variables = {
    data: {
      emailID: 'deepika@mail.com',
      password: 'Somewrongpass12'
    }
  };
  await expect(
    client.mutate({
      mutation: login,
      variables
    })
  ).rejects.toThrow();
});

test('should reject signup with short password', async () => {
  const variables = {
    data: {
      name: 'rani',
      email: 'rani@mail.com',
      password: 'Wrong6'
    }
  };

  await expect(
    client.mutate({
      mutation: createUser,
      variables
    })
  ).rejects.toThrow();
});

test('should fetch user One profile', async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({
    query: getProfile
  });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});

test('should fetch user Two profile', async () => {
  const client = getClient(userTwo.jwt);

  const { data } = await client.query({
    query: getProfile
  });

  expect(data.me.id).toBe(userTwo.user.id);
  expect(data.me.name).toBe(userTwo.user.name);
  expect(data.me.email).toBe(userTwo.user.email);
});
