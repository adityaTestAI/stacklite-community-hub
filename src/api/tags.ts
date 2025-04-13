
import { connectToDatabase } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import { Tag as TagType } from '@/types';

// Get all tags
export async function getAllTags(): Promise<TagType[]> {
  try {
    await connectToDatabase();
    const query = Tag.find({}).sort({ count: -1 });
    const tags = await query.exec();
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
    await connectToDatabase();
    const query = Tag.findOne({ name: name.toLowerCase() });
    const tag = await query.exec();
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
    await connectToDatabase();
    const updatedTags: TagType[] = [];
    
    for (const name of tagNames) {
      const normalizedName = name.toLowerCase().trim();
      
      // Use findOneAndUpdate with upsert to create if not exists
      const query = Tag.findOneAndUpdate(
        { name: normalizedName },
        { $inc: { count: 1 } }, // Increment count by 1
        { new: true, upsert: true } // Return updated document, create if not exists
      );
      
      const tag = await query.exec();
      
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
    await connectToDatabase();
    const query = Tag.findByIdAndDelete(id);
    const result = await query.exec();
    return !!result;
  } catch (error) {
    console.error(`Error deleting tag ${id}:`, error);
    throw error;
  }
}
