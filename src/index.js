import '@babel/polyfill/noConflict';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import { resolvers, fragmentReplacements } from './resolvers/index';
import prisma from './prisma';

// Scalar types --> String, Boolean, Int, Float, ID

// * check out david cutter music

//! type definitons (schema)
// ! uppercase first letter for all the types in graphql
// ? arguments arguments are used to get data input from the user

// * resolvers
/**
 * !4 arguments passed to all reslver arguments.They are
 * *parent --> is very common and it is useful when working with relational data
 * *args --> this contains the operational arguments supplied by the user!
 * *context --> is typically shortened to 'ctx' is useful in detemining the contexutual data
 * *info --> it contains the great information of the actual operation that is sent along to the server
 */

// subscritpion pubsub setup

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request
    };
  },
  fragmentReplacements
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log('the server is up! 🚀 🚀 ');
});
