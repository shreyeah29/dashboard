// Script to update mining company image in the database
require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./src/models/Company');

const updateMiningImage = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update Mining image to large mining operations scene
    const miningResult = await Company.findOneAndUpdate(
      { name: /mining|minerals/i },
      { 
        heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
      },
      { new: true }
    );
    
    if (miningResult) {
      console.log('✅ Updated Mining image:', miningResult.name);
      console.log('New image URL:', miningResult.heroImage);
    } else {
      console.log('⚠️  Mining company not found');
    }

    console.log('\n✅ Mining image updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating mining image:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the update
updateMiningImage();

