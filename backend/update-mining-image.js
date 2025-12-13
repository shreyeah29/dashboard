// Script to update mining company image in the database
require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./src/models/Company');

const updateMiningImage = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update Mining image to mining work background
    const miningResult = await Company.findOneAndUpdate(
      { name: /mining|minerals/i },
      { 
        heroImage: 'https://static.vecteezy.com/system/resources/previews/046/249/257/large_2x/mining-work-background-free-photo.jpg'
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

