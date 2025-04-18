
import { connectToDatabase } from '@/lib/mongodb';
import TagModel from '@/models/Tag';
import { Tag as TagType } from '@/types';

// Fallback data for browser environment
const mockTags: TagType[] = [
  { id: "1", name: "react", count: 5 },
  { id: "2", name: "typescript", count: 3 },
  { id: "3", name: "javascript", count: 7 }
];

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Get all tags
export async function getAllTags(): Promise<TagType[]> {
  try {
    await connectToDatabase();
    
    // In browser, fall back to API call
    if (isBrowser) {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      return data.map((tag: any) => ({
        id: tag._id || tag.id,
        name: tag.name,
        count: tag.count
      }));
    }
    
    const tags = await TagModel.find({}).sort({ count: -1 }).exec();
    return tags.map(tag => ({
      id: tag._id.toString(),
      name: tag.name,
      count: tag.count
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return mockTags; // Fallback to mock data if all else fails
  }
}

// Get a single tag by name
export async function getTagByName(name: string): Promise<TagType | null> {
  try {
    await connectToDatabase();
    
    if (isBrowser) {
      const response = await fetch(`/api/tags/${name}`);
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
    }
    
    const tag = await TagModel.findOne({ name: name.toLowerCase() }).exec();
    if (!tag) return null;
    
    return {
      id: tag._id.toString(),
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
    await connectToDatabase();
    
    if (isBrowser) {
      const response = await fetch('/api/tags', {
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
    }
    
    const updatedTags: TagType[] = [];
    
    for (const name of tagNames) {
      const normalizedName = name.toLowerCase().trim();
      
      // Use findOneAndUpdate with upsert to create if not exists
      const tag = await TagModel.findOneAndUpdate(
        { name: normalizedName },
        { $inc: { count: 1 } }, // Increment count by 1
        { new: true, upsert: true } // Return updated document, create if not exists
      ).exec();
      
      updatedTags.push({
        id: tag._id.toString(),
        name: tag.name,
        count: tag.count
      });
    }
    
    return updatedTags;
  } catch (error) {
    console.error("Error creating/updating tags:", error);
    return [];
  }
}

// Delete a tag
export async function deleteTag(id: string): Promise<boolean> {
  try {
    await connectToDatabase();
    
    if (isBrowser) {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    }
    
    const result = await TagModel.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error) {
    console.error(`Error deleting tag ${id}:`, error);
    return false;
  }
}
