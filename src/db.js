const users = [
  {
    id: '1',
    name: 'arjun',
    email: 'arjun@example.com'
  },
  {
    id: '2',
    name: 'leela',
    email: 'leela@example.com',
    age: 19
  },
  {
    id: '3',
    name: 'subatra',
    email: 'subatra@example.com',
    age: 34
  }
];

const posts = [
  {
    id: '11',
    author: '1',
    title: 'Avengers Endgame',
    body: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
    published: true
  },
  {
    id: '12',
    author: '1',
    title: 'Avengers Ultron',
    body: '',
    published: false
  },
  {
    id: '13',
    author: '3',
    title: 'Interstellar time',
    body:
      ' debitis aliquid quas dolore, vitae nulla hic? Unde dicta natus rerum et?',
    published: true
  }
];

const comments = [
  {
    id: '56',
    text: 'Lorem, ipsum dolor.',
    author: '1',
    postID: '12'
  },
  {
    id: '98',
    text: ' Lorem ipsum dolor sit amet consectetur.',
    author: '1',
    postID: '13'
  },
  {
    id: '13',
    text: ' sit, amet consectetur adipisicing elit.',
    author: '3',
    postID: '13'
  },
  {
    id: '72',
    text: 'it et cur adipisicing elit. Perferendis!',
    author: '1',
    postID: '11'
  }
];

const db = {
  users,
  posts,
  comments
};

export { db as default };
