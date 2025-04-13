
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import { createOrUpdateTags } from './tags';
import { Post as PostType } from '@/types';

// Get all posts
export async function getAllPosts(): Promise<PostType[]> {
  try {
    await connectToDatabase();
    const query = Post.find({}).sort({ createdAt: -1 });
    const posts = await query.exec();
    
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
    const query = Post.findById(id);
    const post = await query.exec();
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
    
    const post = await Post.create(newPost);
    
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
    
    const query = Post.findByIdAndUpdate(
      id,
      { ...postData },
      { new: true }
    );
    
    const post = await query.exec();
    
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
    const query = Post.findByIdAndDelete(id);
    const result = await query.exec();
    return !!result;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
}
