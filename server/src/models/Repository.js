const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  githubId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  htmlUrl: {
    type: String,
    required: true
  },
  stargazersCount: {
    type: Number,
    default: 0
  },
  forksCount: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: null
  },
  owner: {
    login: String,
    avatarUrl: String,
    htmlUrl: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  searchKeyword: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient searching
repositorySchema.index({ searchKeyword: 1, createdAt: -1 });
repositorySchema.index({ githubId: 1 });
repositorySchema.index({ stargazersCount: -1 });

// Virtual for repository age
repositorySchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Instance method to check if repository is popular
repositorySchema.methods.isPopular = function() {
  return this.stargazersCount > 1000;
};

// Static method to find by keyword
repositorySchema.statics.findByKeyword = function(keyword) {
  return this.find({ searchKeyword: new RegExp(keyword, 'i') });
};

module.exports = mongoose.model('Repository', repositorySchema);