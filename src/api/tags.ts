
import { Tag as TagType } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api';

// Get all tags
export async function getAllTags(): Promise<TagType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data.map((tag: any) => ({
      id: tag._id || tag.id,
      name: tag.name,
      count: tag.count
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// Get a single tag by name
export async function getTagByName(name: string): Promise<TagType | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/${name}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error ${response.status}`);
    }
    const tag = await response.json();
    return {
      id: tag._id || tag.id,
      name: tag.name,
      count: tag.count
    };
  } catch (error) {
    console.error(`Error fetching tag ${name}:`, error);
    return null;
  }
}

// Create or update tags
export async function createOrUpdateTags(tagNames: string[]): Promise<TagType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: tagNames }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((tag: any) => ({
      id: tag._id || tag.id,
      name: tag.name,
      count: tag.count
    }));
  } catch (error) {
    console.error("Error creating/updating tags:", error);
    return [];
  }
}

// Delete a tag
export async function deleteTag(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error deleting tag ${id}:`, error);
    return false;
  }
}
