
import express from 'express';
import cors from 'cors';
import { connectToDatabase, seedDatabase } from './lib/mongodb';
import mongoose from 'mongoose';
import PostModel from './models/Post';
import TagModel from './models/Tag';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'https://localhost:8080'], // Add your frontend URL
  credentials: true
}));
app.use(express.json());

// Connect to database and seed if necessary
async function initializeDatabase() {
  try {
    const connection = await connectToDatabase();
    console.log('Connected to MongoDB');
    
    // Only seed after successful connection
    if (connection) {
      await seedDatabase();
      console.log('Database ready');
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

// Initialize the database
initializeDatabase();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Posts routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await PostModel.find({}).sort({ createdAt: -1 }).exec();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id).exec();
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error(`Error fetching post ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, authorId, authorName, tags } = req.body;
    
    // Update tags first
    const tagNames = tags || [];
    for (const name of tagNames) {
      const normalizedName = name.toLowerCase().trim();
      await TagModel.findOneAndUpdate(
        { name: normalizedName },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      ).exec();
    }
    
    // Create the post
    const newPost = await PostModel.create({
      title,
      content,
      authorId,
      authorName,
      tags: tagNames,
      createdAt: new Date(),
      upvotes: 0,
      views: 0,
      answers: []
    });
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Tags routes
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await TagModel.find({}).sort({ count: -1 }).exec();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

app.get('/api/tags/:name', async (req, res) => {
  try {
    const tag = await TagModel.findOne({ name: req.params.name.toLowerCase() }).exec();
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json(tag);
  } catch (error) {
    console.error(`Error fetching tag ${req.params.name}:`, error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

export default app;
