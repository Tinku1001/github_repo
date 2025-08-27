const Repository = require('../models/Repository');
const githubService = require('../services/githubService');
const logger = require('../utils/logger');

class RepositoryController {
  async searchAndStore(req, res, next) {
    try {
      const { keyword, page = 1, limit = 10 } = req.query;
      
      if (!keyword || keyword.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Keyword is required'
        });
      }

      // Search GitHub API
      const githubData = await githubService.searchRepositories(
        keyword.trim(),
        parseInt(page),
        parseInt(limit)
      );

      // Store repositories in database
      const savedRepositories = [];
      for (const repo of githubData.repositories) {
        try {
          const repositoryData = {
            githubId: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || '',
            htmlUrl: repo.html_url,
            stargazersCount: repo.stargazers_count,
            forksCount: repo.forks_count,
            language: repo.language,
            owner: {
              login: repo.owner.login,
              avatarUrl: repo.owner.avatar_url,
              htmlUrl: repo.owner.html_url
            },
            searchKeyword: keyword.trim().toLowerCase()
          };

          const existingRepo = await Repository.findOne({ githubId: repo.id });
          
          let savedRepo;
          if (existingRepo) {
            // Update existing repository
            savedRepo = await Repository.findByIdAndUpdate(
              existingRepo._id,
              { ...repositoryData, updatedAt: new Date() },
              { new: true }
            );
          } else {
            // Create new repository
            savedRepo = await Repository.create(repositoryData);
          }
          
          savedRepositories.push(savedRepo);
        } catch (dbError) {
          logger.error('Database save error for repo:', repo.id, dbError.message);
          // Continue with other repositories
        }
      }

      res.status(200).json({
        success: true,
        data: {
          repositories: savedRepositories,
          pagination: {
            currentPage: githubData.page,
            totalPages: githubData.totalPages,
            totalCount: githubData.totalCount,
            perPage: githubData.perPage
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  async getStoredRepositories(req, res, next) {
    try {
      const { 
        keyword, 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;

      const query = keyword ? 
        { searchKeyword: new RegExp(keyword, 'i') } : {};

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      };

      const repositories = await Repository.find(query)
        .sort(options.sort)
        .limit(options.limit * 1)
        .skip((options.page - 1) * options.limit)
        .exec();

      const totalCount = await Repository.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          repositories,
          pagination: {
            currentPage: options.page,
            totalPages: Math.ceil(totalCount / options.limit),
            totalCount,
            perPage: options.limit
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  async deleteRepository(req, res, next) {
    try {
      const { id } = req.params;

      const repository = await Repository.findByIdAndDelete(id);
      
      if (!repository) {
        return res.status(404).json({
          success: false,
          message: 'Repository not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Repository deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  async getSearchHistory(req, res, next) {
    try {
      const { limit = 10 } = req.query;

      const searchHistory = await Repository.aggregate([
        {
          $group: {
            _id: '$searchKeyword',
            count: { $sum: 1 },
            lastSearched: { $max: '$createdAt' }
          }
        },
        {
          $sort: { lastSearched: -1 }
        },
        {
          $limit: parseInt(limit)
        }
      ]);

      res.status(200).json({
        success: true,
        data: searchHistory
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RepositoryController();