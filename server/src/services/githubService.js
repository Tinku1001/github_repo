const axios = require('axios');
const logger = require('../utils/logger');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Repo-Search-App'
    };

    // Add GitHub token if provided (increases rate limits from 60 to 5000 per hour)
    if (process.env.GITHUB_TOKEN) {
      this.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      logger.info('✅ GitHub token configured - Higher rate limits enabled');
    } else {
      logger.warn('⚠️  No GitHub token provided - Using lower rate limits (60 requests/hour)');
      logger.warn('💡 Add GITHUB_TOKEN to your .env file for better performance');
    }
  }

  async searchRepositories(keyword, page = 1, perPage = 10) {
    try {
      logger.info(`🔍 Searching GitHub for: "${keyword}" (page ${page})`);

      const response = await axios.get(`${this.baseURL}/search/repositories`, {
        headers: this.headers,
        params: {
          q: keyword,
          sort: 'stars',
          order: 'desc',
          page,
          per_page: Math.min(perPage, 100) // GitHub max is 100
        },
        timeout: 15000
      });

      const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
      const rateLimitReset = response.headers['x-ratelimit-reset'];
      
      logger.info(`✅ GitHub API response: ${response.data.items.length} repositories found`);
      logger.info(`📊 Rate limit: ${rateLimitRemaining} requests remaining`);

      return {
        repositories: response.data.items,
        totalCount: Math.min(response.data.total_count, 1000), // GitHub limits to 1000 results
        page,
        perPage,
        totalPages: Math.ceil(Math.min(response.data.total_count, 1000) / perPage),
        rateLimit: {
          remaining: parseInt(rateLimitRemaining),
          reset: new Date(parseInt(rateLimitReset) * 1000).toISOString()
        }
      };

    } catch (error) {
      logger.error('❌ GitHub API Error:', error.message);
      
      if (error.response) {
        const { status, data, headers } = error.response;
        
        // Handle rate limiting
        if (status === 403 && headers['x-ratelimit-remaining'] === '0') {
          const resetTime = new Date(parseInt(headers['x-ratelimit-reset']) * 1000);
          throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime.toLocaleString()}`);
        }
        
        // Handle other GitHub API errors
        if (status === 422) {
          throw new Error('Search query is invalid or too complex');
        }
        
        throw new Error(`GitHub API Error (${status}): ${data.message || 'Unknown error'}`);
      }
      
      // Handle network errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('GitHub API request timed out');
      }
      
      throw new Error('Failed to connect to GitHub API. Please check your internet connection.');
    }
  }

  async getRepositoryDetails(owner, repo) {
    try {
      logger.info(`📋 Getting details for: ${owner}/${repo}`);
      
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}`, {
        headers: this.headers,
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      logger.error(`❌ Error getting repository details for ${owner}/${repo}:`, error.message);
      throw new Error(`Failed to get repository details: ${error.message}`);
    }
  }

  async checkRateLimit() {
    try {
      const response = await axios.get(`${this.baseURL}/rate_limit`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      logger.error('❌ Error checking rate limit:', error.message);
      return null;
    }
  }
}

module.exports = new GitHubService();