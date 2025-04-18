import { connectToDatabase } from '@/lib/mongodb';
import PostModel, { AnswerDocument } from '@/models/Post';
import { createOrUpdateTags } from './tags';
import { Post as PostType, Answer as AnswerType } from '@/types';
import mongoose from 'mongoose';

// Fallback data for browser environment
const mockPosts: PostType[] = [
  {
    id: "1",
    title: "Sample Post",
    content: "This is a sample post when offline",
    authorId: "sample-author",
    authorName: "Sample User",
    createdAt: new Date().toISOString(),
    tags: ["react", "typescript"],
    upvotes: 0,
    views: 0,
    answers: []
  }
];

// Get all posts
export async function getAllPosts(): Promise<PostType[]> {
  try {
    await connectToDatabase();
    
    // In browser, return mock data
    
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
    await connectToDatabase();
    const result = await PostModel.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
}
