import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, {
  userOne,
  commentByUserOne,
  commentByUserTwo
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import { deleteComment } from './utils/operations';

beforeEach(seedDatabase);

test('should delete own comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentByUserOne.comment.id
  };

  const { data } = await client.mutate({
    mutation: deleteComment,
    variables
  });

  const isExists = await prisma.exists.Comment({
    id: data.deleteComment.id
  });
  expect(isExists).toBe(false);
});

test('should not delete other users comment ', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentByUserTwo.comment.id
  };

  await expect(
    client.mutate({
      mutation: deleteComment,
      variables
    })
  ).rejects.toThrow();
});
