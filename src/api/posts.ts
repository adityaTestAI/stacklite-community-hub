import { Post as PostType, Answer as AnswerType } from '@/types';
import { API_BASE_URL } from '@/config'; // Adjust the path as necessary

// Get all posts
export async function getAllPosts(): Promise<PostType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data.map((post: PostType & { _id?: string }) => ({
      id: post._id || post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: new Date(post.createdAt).toISOString(),
      tags: post.tags,
      upvotes: post.upvotes,
      views: post.views,
      upvotedBy: post.upvotedBy || [],
      answers: (post.answers || []).map((ans: AnswerType) => ({
        id: ans.id,
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: new Date(ans.createdAt).toISOString(),
        upvotes: ans.upvotes,
        upvotedBy: ans.upvotedBy || []
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
      upvotedBy: post.upvotedBy || [],
      answers: (post.answers || []).map((ans: AnswerType) => ({
        id: ans.id,
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: new Date(ans.createdAt).toISOString(),
        upvotes: ans.upvotes,
        upvotedBy: ans.upvotedBy || []
      }))
    };
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
}

// Toggle upvote on a post
export async function togglePostUpvote(postId: string, userId: string): Promise<{ upvotes: number, upvotedBy: string[] } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error toggling upvote for post ${postId}:`, error);
    return null;
  }
}

// Toggle upvote on an answer
export async function toggleAnswerUpvote(postId: string, answerId: string, userId: string): Promise<{ upvotes: number, upvotedBy: string[] } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/answers/${answerId}/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error toggling upvote for answer ${answerId}:`, error);
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
      upvotedBy: post.upvotedBy || [],
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
      upvotedBy: post.upvotedBy || [],
      answers: (post.answers || []).map((ans: AnswerType) => ({
        id: ans.id,
        content: ans.content,
        authorId: ans.authorId,
        authorName: ans.authorName,
        createdAt: new Date(ans.createdAt).toISOString(),
        upvotes: ans.upvotes,
        upvotedBy: ans.upvotedBy || []
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
