
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import { createOrUpdateTags } from './tags';
import { Post as PostType } from '@/types';
import mongoose from 'mongoose';

// Get all posts
export async function getAllPosts(): Promise<PostType[]> {
  try {
    await connectToDatabase();
    // Use proper model reference and cast to any to bypass TypeScript's union type check
    const posts = await (Post as any).find({}).sort({ createdAt: -1 }).exec();
    
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
      answers: post.answers.map(ans => ({
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
    // Use proper model reference and cast to any
    const post = await (Post as any).findById(id).exec();
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
      answers: post.answers.map(ans => ({
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
    
    // Cast to any to bypass TypeScript's union type check
    const post = await (Post as any).create(newPost);
    
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
    
    // Cast to any to bypass TypeScript's union type check
    const post = await (Post as any).findByIdAndUpdate(
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
      answers: post.answers.map(ans => ({
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
    // Cast to any to bypass TypeScript's union type check
    const result = await (Post as any).findByIdAndDelete(id).exec();
    return !!result;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
}
