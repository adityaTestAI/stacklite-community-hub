
import { connectToDatabase, isBrowser } from '@/lib/mongodb';
import TagModel from '@/models/Tag';
import { Tag as TagType } from '@/types';
import { mockTags } from '@/lib/mockData';

// Get all tags
export async function getAllTags(): Promise<TagType[]> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Using mock tags data");
      return mockTags;
    }
    
    await connectToDatabase();
    const tags = await TagModel.find({}).sort({ count: -1 }).exec();
    return tags.map(tag => ({
      id: tag._id.toString(),
      name: tag.name,
      count: tag.count
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}

// Get a single tag by name
export async function getTagByName(name: string): Promise<TagType | null> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Using mock tag data for name:", name);
      const tag = mockTags.find(t => t.name.toLowerCase() === name.toLowerCase());
      return tag || null;
    }
    
    await connectToDatabase();
    const tag = await TagModel.findOne({ name: name.toLowerCase() }).exec();
    if (!tag) return null;
    
    return {
      id: tag._id.toString(),
      name: tag.name,
      count: tag.count
    };
  } catch (error) {
    console.error(`Error fetching tag ${name}:`, error);
    throw error;
  }
}

// Create or update tags
export async function createOrUpdateTags(tagNames: string[]): Promise<TagType[]> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Creating/updating mock tags");
      const updatedMockTags: TagType[] = [];
      
      for (const name of tagNames) {
        const normalizedName = name.toLowerCase().trim();
        const existingTagIndex = mockTags.findIndex(t => t.name === normalizedName);
        
        if (existingTagIndex !== -1) {
          updatedMockTags.push({
            ...mockTags[existingTagIndex],
            count: mockTags[existingTagIndex].count + 1
          });
        } else {
          const newTag: TagType = {
            id: Math.random().toString(36).substring(2, 15),
            name: normalizedName,
            count: 1
          };
          updatedMockTags.push(newTag);
        }
      }
      
      return updatedMockTags;
    }
    
    await connectToDatabase();
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
    throw error;
  }
}

// Delete a tag
export async function deleteTag(id: string): Promise<boolean> {
  try {
    // Use mock data in browser environment
    if (isBrowser) {
      console.log("Deleting mock tag");
      return true;
    }
    
    await connectToDatabase();
    const result = await TagModel.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error) {
    console.error(`Error deleting tag ${id}:`, error);
    throw error;
  }
}
