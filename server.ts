
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './src/lib/mongodb';
import mongoose from 'mongoose';
import PostModel from './src/models/Post';
import TagModel from './src/models/Tag';
import UserModel from './src/models/User';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'https://localhost:8080'], // Add your frontend URL
  credentials: true
}));
app.use(express.json());

// Connect to database
async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    const connection = await connectToDatabase();
    
    if (connection) {
      console.log('Connected to MongoDB');
    } else {
      console.log('Failed to get MongoDB connection');
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

app.patch('/api/posts/:id', async (req, res) => {
  try {
    const updateData = req.body;
    
    // If tags are being updated, update tag counts
    if (updateData.tags && updateData.tags.length > 0) {
      for (const name of updateData.tags) {
        const normalizedName = name.toLowerCase().trim();
        await TagModel.findOneAndUpdate(
          { name: normalizedName },
          { $inc: { count: 1 } },
          { new: true, upsert: true }
        ).exec();
      }
    }
    
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).exec();
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error(`Error updating post ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const result = await PostModel.findByIdAndDelete(req.params.id).exec();
    
    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error(`Error deleting post ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete post' });
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

app.post('/api/tags', async (req, res) => {
  try {
    const { tags } = req.body;
    const results = [];
    
    for (const name of tags) {
      const normalizedName = name.toLowerCase().trim();
      const tag = await TagModel.findOneAndUpdate(
        { name: normalizedName },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      ).exec();
      
      results.push(tag);
    }
    
    res.status(201).json(results);
  } catch (error) {
    console.error('Error creating/updating tags:', error);
    res.status(500).json({ error: 'Failed to create/update tags' });
  }
});

app.delete('/api/tags/:id', async (req, res) => {
  try {
    const result = await TagModel.findByIdAndDelete(req.params.id).exec();
    
    if (!result) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error(`Error deleting tag ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

// User routes
app.get('/api/users/:uid', async (req, res) => {
  try {
    const user = await UserModel.findOne({ uid: req.params.uid }).exec();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(`Error fetching user ${req.params.uid}:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }
    
    const user = await UserModel.findOneAndUpdate(
      { uid },
      { 
        uid,
        email, 
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || '',
        updatedAt: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to create/update user' });
  }
});

app.patch('/api/users/:uid/profile', async (req, res) => {
  try {
    const { displayName, photoURL } = req.body;
    
    const user = await UserModel.findOneAndUpdate(
      { uid: req.params.uid },
      { 
        ...(displayName !== undefined && { displayName }),
        ...(photoURL !== undefined && { photoURL }),
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(`Error updating user profile ${req.params.uid}:`, error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

app.patch('/api/users/:uid/notifications', async (req, res) => {
  try {
    const settings = req.body;
    
    const updateData = Object.entries(settings).reduce((acc, [key, value]) => {
      acc[`notificationSettings.${key}`] = value;
      return acc;
    }, {} as Record<string, any>);
    
    const user = await UserModel.findOneAndUpdate(
      { uid: req.params.uid },
      { 
        $set: updateData,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(`Error updating notification settings for user ${req.params.uid}:`, error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
});

app.patch('/api/users/:uid/appearance', async (req, res) => {
  try {
    const settings = req.body;
    
    const updateData = Object.entries(settings).reduce((acc, [key, value]) => {
      acc[`appearance.${key}`] = value;
      return acc;
    }, {} as Record<string, any>);
    
    const user = await UserModel.findOneAndUpdate(
      { uid: req.params.uid },
      { 
        $set: updateData,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(`Error updating appearance settings for user ${req.params.uid}:`, error);
    res.status(500).json({ error: 'Failed to update appearance settings' });
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
