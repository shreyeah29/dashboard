// Script to update company images in the database
require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./src/models/Company');

const updateCompanyImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update Enterprises to use mining image
    const enterprisesResult = await Company.findOneAndUpdate(
      { name: /enterprises/i },
      { 
        heroImage: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
      },
      { new: true }
    );
    
    if (enterprisesResult) {
      console.log('✅ Updated Enterprises image:', enterprisesResult.name);
    } else {
      console.log('⚠️  Enterprises company not found');
    }

    // Update Mining to use new excavation image
    const miningResult = await Company.findOneAndUpdate(
      { name: /mining|minerals/i },
      { 
        heroImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
      },
      { new: true }
    );
    
    if (miningResult) {
      console.log('✅ Updated Mining image:', miningResult.name);
    } else {
      console.log('⚠️  Mining company not found');
    }

    console.log('\n✅ Company images updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating company images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the update
updateCompanyImages();

