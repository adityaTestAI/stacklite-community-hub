
import { Post, Tag, Answer } from '@/types';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate mock answers
const generateAnswers = (count: number): Answer[] => {
  return Array(count).fill(null).map((_, i) => ({
    id: generateId(),
    content: `This is a sample answer ${i + 1}. It provides information related to the question.`,
    authorId: generateId(),
    authorName: `User${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: Math.floor(Math.random() * 50),
    upvotedBy: [] // Initialize with empty array
  }));
};

// Generate mock tags
export const mockTags: Tag[] = [
  { id: '1', name: 'react', count: 24 },
  { id: '2', name: 'javascript', count: 18 },
  { id: '3', name: 'typescript', count: 12 },
  { id: '4', name: 'mongodb', count: 8 },
  { id: '5', name: 'node.js', count: 15 },
  { id: '6', name: 'express', count: 7 },
  { id: '7', name: 'nextjs', count: 10 },
  { id: '8', name: 'css', count: 14 },
  { id: '9', name: 'html', count: 9 },
  { id: '10', name: 'tailwind', count: 11 }
];

// Generate mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'How to use React hooks effectively?',
    content: 'I\'m trying to understand the best practices for using React hooks in my components. Can someone explain when to use useEffect vs useLayoutEffect and how to properly handle dependencies?',
    authorId: 'user1',
    authorName: 'JohnDoe',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['react', 'javascript', 'hooks'],
    upvotes: 15,
    views: 230,
    answers: generateAnswers(3),
    upvotedBy: [] // Add required property
  },
  {
    id: '2',
    title: 'Understanding TypeScript interfaces vs types',
    content: 'What are the main differences between interfaces and types in TypeScript? When should I use one over the other?',
    authorId: 'user2',
    authorName: 'JaneSmith',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['typescript', 'javascript'],
    upvotes: 22,
    views: 450,
    answers: generateAnswers(5),
    upvotedBy: [] // Add required property
  },
  {
    id: '3',
    title: 'Best practices for MongoDB with Node.js',
    content: 'I\'m building a Node.js application with MongoDB and want to ensure I\'m following best practices for data modeling and querying. Any recommendations?',
    authorId: 'user3',
    authorName: 'SamWilson',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['mongodb', 'node.js', 'database'],
    upvotes: 8,
    views: 120,
    answers: generateAnswers(2),
    upvotedBy: [] // Add required property
  },
  {
    id: '4',
    title: 'How to optimize Tailwind CSS for production?',
    content: 'My project using Tailwind CSS has a large bundle size. What are the best approaches to optimize it for production?',
    authorId: 'user4',
    authorName: 'AlexJohnson',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['tailwind', 'css', 'optimization'],
    upvotes: 12,
    views: 280,
    answers: generateAnswers(4),
    upvotedBy: [] // Add required property
  },
  {
    id: '5',
    title: 'Error handling in async/await functions',
    content: 'What\'s the most elegant way to handle errors in async/await functions? Should I use try/catch blocks everywhere?',
    authorId: 'user5',
    authorName: 'EmilyBrown',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['javascript', 'async', 'error-handling'],
    upvotes: 30,
    views: 620,
    answers: generateAnswers(7),
    upvotedBy: [] // Add required property
  }
];
