const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: false,
    unique: true,
    lowercase: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  teamSize: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  milestones: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: Date,
    completedDate: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create slug from name
projectSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
