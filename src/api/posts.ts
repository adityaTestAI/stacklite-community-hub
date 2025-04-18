
import { Post as PostType, Answer as AnswerType } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api';

// Get all posts
export async function getAllPosts(): Promise<PostType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data.map((post: any) => ({
      id: post._id || post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: new Date(post.createdAt).toISOString(),
      tags: post.tags,
      upvotes: post.upvotes,
      views: post.views,
      answers: (post.answers || []).map((ans: any) => ({
        id: ans._id || ans.id,
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: new Date(ans.createdAt).toISOString(),
        upvotes: ans.upvotes
      }))
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Get a single post by ID
export async function getPostById(id: string): Promise<PostType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error ${response.status}`);
    }
    const post = await response.json();
    return {
      id: post._id || post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: new Date(post.createdAt).toISOString(),
      tags: post.tags,
      upvotes: post.upvotes,
      views: post.views,
      answers: (post.answers || []).map((ans: any) => ({
        id: ans._id || ans.id,
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: new Date(ans.createdAt).toISOString(),
        upvotes: ans.upvotes
      }))
    };
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
}

// Create a new post
export async function createPost(postData: Omit<PostType, 'id' | 'createdAt' | 'answers'>): Promise<PostType> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const post = await response.json();
    return {
      id: post._id || post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: new Date(post.createdAt).toISOString(),
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
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const post = await response.json();
    return {
      id: post._id || post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: new Date(post.createdAt).toISOString(),
      tags: post.tags,
      upvotes: post.upvotes,
      views: post.views,
      answers: (post.answers || []).map((ans: any) => ({
        id: ans._id || ans.id,
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: new Date(ans.createdAt).toISOString(),
        upvotes: ans.upvotes
      }))
    };
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    return null;
  }
}

// Delete a post
export async function deletePost(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    return false;
  }
}
