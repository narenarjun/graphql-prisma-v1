import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
});

export { prisma as default };

// prisma.query, prisma.mutation, prisma.subscription, prisma.exists

// ! prisma-exists-->example
// prisma.exists
//   .Post({
//     id: 'ck475e5m900xj0766tkm1embn'
//   })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// const createPostForUser = async (authorID, data) => {
//   const userExists = await prisma.exists.User({
//     id: authorID
//   });
//   if (!userExists) {
//     throw new Error('User not found');
//   }
//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorID
//           }
//         }
//       }
//     },
//     '{author{id name email  posts{id title published}} }'
//   );

//   return post.author;
// };

// // createPostForUser('ck45zvter006i0766c01swasi', {
// //   title: 'The war of art ',
// //   body: 'great books to read, recommended by many coders',
// //   published: true
// // })
// //   .then(user => {
// //     console.log(JSON.stringify(user, undefined, 2));
// //   })
// //   .catch(error => {
// //     console.log(error.message);
// //   });

// const updatePostForUser = async (postID, data) => {
//   const postExists = await prisma.exists.Post({
//     id: postID
//   });
//   if (!postExists) {
//     new Error('Post not found');
//   }
//   const post = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postID
//       },
//       data
//     },
//     '{author {id name email posts{id title published} }}'
//   );
//   return post;
// };

// updatePostForUser('ck475e5m900xj0766tkm1embn', {
//   published: true,
//   body: 'this is made to check how prisa.exists work',
//   title: 'post made after adding await'
// })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 4));
//   })
//   .catch(error => {
//     console.log(error.message);
//   });
