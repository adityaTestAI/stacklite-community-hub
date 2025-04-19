/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './src/lib/mongodb.js';
import PostModel from './src/models/Post.js';
import TagModel from './src/models/Tag.js';
import UserModel from './src/models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',  // Vite default port
  'http://localhost:8082',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://stack-lite.netlify.app',  // Production Netlify frontend
  'https://stack-overflowr.onrender.com'
].filter(Boolean);

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Origin not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Configure multer for temporary file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
      return;
    }
    cb(null, true);
  }
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// Connect to database
async function initializeDatabase() {
  try {
    await connectToDatabase();
    console.log("✅ MongoDB connection established. Starting server...");
  } catch (error) {
    console.error("❌ Failed to get MongoDB connection");
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

app.get('/api/posts/:id', async (req, res): Promise<any> => {
  try {
    const post = await PostModel.findById(req.params.id).exec();
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment view count (ensure views is a number)
    post.views = (post.views || 0) + 1;
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

app.patch('/api/posts/:id', async (req, res): Promise<any> => {
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

app.delete('/api/posts/:id', async (req, res): Promise<any> => {
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

// Add a new route to handle post upvotes
app.post('/api/posts/:id/upvote', async (req, res): Promise<any> => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const post = await PostModel.findById(req.params.id).exec();
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user has already upvoted
    const userIndex = post.upvotedBy.indexOf(userId);
    
    if (userIndex === -1) {
      // User hasn't upvoted yet, add upvote
      post.upvotedBy.push(userId);
      post.upvotes += 1;
    } else {
      // User already upvoted, remove upvote
      post.upvotedBy.splice(userIndex, 1);
      post.upvotes = Math.max(0, post.upvotes - 1); // Ensure upvotes doesn't go below 0
    }
    
    await post.save();
    
    res.json({ upvotes: post.upvotes, upvotedBy: post.upvotedBy });
  } catch (error) {
    console.error(`Error toggling upvote for post ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to toggle upvote' });
  }
});

// Add a similar route for answer upvotes
app.post('/api/posts/:postId/answers/:answerId/upvote', async (req, res): Promise<any> => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const post = await PostModel.findById(req.params.postId).exec();
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const answer = post.answers.id(req.params.answerId);
    
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    
    // Initialize upvotedBy array if it doesn't exist
    if (!answer.upvotedBy) {
      answer.upvotedBy = [];
    }
    
    // Check if user has already upvoted
    const userIndex = answer.upvotedBy.indexOf(userId);
    
    if (userIndex === -1) {
      // User hasn't upvoted yet, add upvote
      answer.upvotedBy.push(userId);
      answer.upvotes += 1;
    } else {
      // User already upvoted, remove upvote
      answer.upvotedBy.splice(userIndex, 1);
      answer.upvotes = Math.max(0, answer.upvotes - 1); // Ensure upvotes doesn't go below 0
    }
    
    await post.save();
    
    res.json({ upvotes: answer.upvotes, upvotedBy: answer.upvotedBy });
  } catch (error) {
    console.error(`Error toggling upvote for answer ${req.params.answerId}:`, error);
    res.status(500).json({ error: 'Failed to toggle upvote' });
  }
});

app.get('/api/tags', async (req, res) => {
  try {
    const tags = await TagModel.find({}).sort({ count: -1 }).exec();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

app.get('/api/tags/:name', async (req, res): Promise<any> => {
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

app.delete('/api/tags/:id', async (req, res): Promise<any> => {
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
app.get('/api/users/:uid', async (req, res): Promise<any> => {
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

app.post('/api/users', async (req, res): Promise<any> => {
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

app.patch('/api/users/:uid/profile', async (req, res): Promise<any> => {
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

app.patch('/api/users/:uid/notifications', async (req, res): Promise<any> => {
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

app.patch('/api/users/:uid/appearance', async (req, res): Promise<any> => {
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

// Add image upload route for base64
app.post('/api/users/:uid/profile/image', upload.single('image'), async (req, res): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert file buffer to base64
    const fileBuffer = req.file.buffer;
    const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
    
    const user = await UserModel.findOneAndUpdate(
      { uid: req.params.uid },
      { 
        photoURL: base64Image,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(`Error uploading profile image for user ${req.params.uid}:`, error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Add image delete route
app.delete('/api/users/:uid/profile/image', async (req, res): Promise<any> => {
  try {
    const user = await UserModel.findOne({ uid: req.params.uid }).exec();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.photoURL = '';
    user.updatedAt = new Date();
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error(`Error deleting profile image for user ${req.params.uid}:`, error);
    res.status(500).json({ error: 'Failed to delete profile image' });
  }
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
