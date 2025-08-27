const express = require('express');
const repositoryController = require('../controllers/repositoryController');
const { validateSearch, validateGetRepositories } = require('../middleware/validation');
const { searchLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Search and store repositories
router.get('/search', 
  searchLimiter, 
  validateSearch, 
  repositoryController.searchAndStore
);

// Get stored repositories
router.get('/', 
  validateGetRepositories, 
  repositoryController.getStoredRepositories
);

// Delete repository
router.delete('/:id', repositoryController.deleteRepository);

// Get search history
router.get('/history', repositoryController.getSearchHistory);

module.exports = router;