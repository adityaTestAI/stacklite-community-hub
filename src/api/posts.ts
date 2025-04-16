
import { connectToDatabase, isBrowser } from '@/lib/mongodb';
import PostModel, { AnswerDocument } from '@/models/Post';
import { createOrUpdateTags } from './tags';
import { Post as PostType, Answer as AnswerType } from '@/types';
import mongoose from 'mongoose';
import { mockPosts } from '@/lib/mockData';

// Get all posts
export async function getAllPosts(): Promise<PostType[]> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Using mock posts data");
      return mockPosts;
    }
    
    await connectToDatabase();
    const posts = await PostModel.find({}).sort({ createdAt: -1 }).exec();
    
    return posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: post.createdAt.toISOString(),
      tags: post.tags,
      upvotes: post.upvotes,
      views: post.views,
      answers: post.answers.map((ans: AnswerDocument) => ({
        id: ans._id.toString(),
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: ans.createdAt.toISOString(),
        upvotes: ans.upvotes
      }))
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

// Get a single post by ID
export async function getPostById(id: string): Promise<PostType | null> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Using mock post data for ID:", id);
      const post = mockPosts.find(p => p.id === id);
      return post || null;
    }
    
    await connectToDatabase();
    const post = await PostModel.findById(id).exec();
    if (!post) return null;
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: post.createdAt.toISOString(),
      tags: post.tags,
      upvotes: post.upvotes,
      views: post.views,
      answers: post.answers.map((ans: AnswerDocument) => ({
        id: ans._id.toString(),
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: ans.createdAt.toISOString(),
        upvotes: ans.upvotes
      }))
    };
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
}

// Create a new post
export async function createPost(postData: Omit<PostType, 'id' | 'createdAt' | 'answers'>): Promise<PostType> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Creating mock post");
      const newMockPost: PostType = {
        id: Math.random().toString(36).substring(2, 15),
        title: postData.title,
        content: postData.content,
        authorId: postData.authorId,
        authorName: postData.authorName,
        createdAt: new Date().toISOString(),
        tags: postData.tags,
        upvotes: 0,
        views: 0,
        answers: []
      };
      // In a real app, we would add this to the mock posts array
      // For demonstration, we'll just return it
      return newMockPost;
    }
    
    await connectToDatabase();
    
    // First update tags
    await createOrUpdateTags(postData.tags);
    
    // Then create the post
    const newPost = {
      ...postData,
      createdAt: new Date(),
      answers: []
    };
    
    const post = await PostModel.create(newPost);
    
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: post.createdAt.toISOString(),
      tags: post.tags,
      upvotes: post.upvotes,
      views: post.views,
      answers: []
    };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// Update a post
export async function updatePost(id: string, postData: Partial<PostType>): Promise<PostType | null> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Updating mock post");
      const existingPostIndex = mockPosts.findIndex(p => p.id === id);
      if (existingPostIndex === -1) return null;
      
      // Return a mock updated post
      const updatedPost = {
        ...mockPosts[existingPostIndex],
        ...postData,
      };
      
      return updatedPost;
    }
    
    await connectToDatabase();
    
    // If tags are being updated, update tag counts
    if (postData.tags && postData.tags.length > 0) {
      await createOrUpdateTags(postData.tags);
    }
    
    const post = await PostModel.findByIdAndUpdate(
      id,
      { ...postData },
      { new: true }
    ).exec();
    
    if (!post) return null;
    
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: post.createdAt.toISOString(),
      tags: post.tags,
      upvotes: post.upvotes,
      views: post.views,
      answers: post.answers.map((ans: AnswerDocument) => ({
        id: ans._id.toString(),
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: ans.createdAt.toISOString(),
        upvotes: ans.upvotes
      }))
    };
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
}

// Delete a post
export async function deletePost(id: string): Promise<boolean> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Deleting mock post");
      // In a real implementation, we would remove from the mock posts array
      return true;
    }
    
    await connectToDatabase();
    const result = await PostModel.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
}
