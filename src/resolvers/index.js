import { extractFragmentReplacements } from 'prisma-binding';
import Query from './Query';
import Mutation from './Mutation';
import Post from './post';
import User from './user';
import Comment from './comment';
import Subscription from './Subscription';

const resolvers = {
  Query,
  Post,
  Subscription,
  Mutation,
  User,
  Comment
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
