import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import SearchForm from './SearchForm';
import RepositoryCard from './RepositoryCard';
import Pagination from './Pagination';
import Loading from './Loading';
import { repositoryAPI } from '../services/api';
import { API_STATES, DEFAULT_PAGE_SIZE, SORT_OPTIONS } from '../utils/constants';
import { RefreshCw, Database, SortAsc, SortDesc } from 'lucide-react';

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(API_STATES.IDLE);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [view, setView] = useState('search'); // 'search' or 'saved'

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
    loadSavedRepositories();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const response = await repositoryAPI.getHistory();
      setSearchHistory(response.data.data);
    } catch (error) {
      console.error('Failed to load search history:', error.message);
    }
  };

  const loadSavedRepositories = async () => {
    try {
      setLoading(API_STATES.LOADING);
      const response = await repositoryAPI.getAll({
        page: currentPage,
        limit: DEFAULT_PAGE_SIZE,
        sortBy,
        sortOrder
      });
      
      if (response.data.success) {
        setRepositories(response.data.data.repositories);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      toast.error(`Failed to load repositories: ${error.message}`);
    } finally {
      setLoading(API_STATES.IDLE);
    }
  };

  const handleSearch = async (keyword) => {
    try {
      setLoading(API_STATES.LOADING);
      setCurrentKeyword(keyword);
      setCurrentPage(1);
      
      const response = await repositoryAPI.search(keyword, 1, DEFAULT_PAGE_SIZE);
      
      if (response.data.success) {
        setRepositories(response.data.data.repositories);
        setPagination(response.data.data.pagination);
        toast.success(`Found ${response.data.data.pagination.totalCount} repositories`);
        loadSearchHistory(); // Refresh search history
      }
    } catch (error) {
      toast.error(`Search failed: ${error.message}`);
      setRepositories([]);
      setPagination({});
    } finally {
      setLoading(API_STATES.IDLE);
    }
  };

  const handlePageChange = async (page) => {
    try {
      setLoading(API_STATES.LOADING);
      setCurrentPage(page);
      
      let response;
      if (view === 'search' && currentKeyword) {
        response = await repositoryAPI.search(currentKeyword, page, DEFAULT_PAGE_SIZE);
      } else {
        response = await repositoryAPI.getAll({
          page,
          limit: DEFAULT_PAGE_SIZE,
          sortBy,
          sortOrder
        });
      }
      
      if (response.data.success) {
        setRepositories(response.data.data.repositories);
        setPagination(response.data.data.pagination);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      toast.error(`Failed to load page: ${error.message}`);
    } finally {
      setLoading(API_STATES.IDLE);
    }
  };

  const handleDelete = async (repositoryId) => {
    try {
      await repositoryAPI.delete(repositoryId);
      toast.success('Repository removed successfully');
      
      // Remove from current list
      setRepositories(prev => prev.filter(repo => repo._id !== repositoryId));
      
      // If this was the last item on the page, go to previous page
      if (repositories.length === 1 && currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    } catch (error) {
      toast.error(`Failed to delete repository: ${error.message}`);
    }
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setCurrentPage(1);
    if (newView === 'saved') {
      loadSavedRepositories();
    }
  };

  const refreshData = () => {
    if (view === 'saved' || !currentKeyword) {
      loadSavedRepositories();
    } else {
      handleSearch(currentKeyword);
    }
  };

  const isLoading = loading === API_STATES.LOADING;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">GitHub Repository Search</h1>
          <p className="dashboard-subtitle">
            Search GitHub repositories and save them to your collection
          </p>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="refresh-button"
            title="Refresh data"
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <SearchForm
          onSearch={handleSearch}
          isLoading={isLoading}
          searchHistory={searchHistory}
        />

        <div className="dashboard-controls">
          <div className="view-toggles">
            <button
              onClick={() => handleViewChange('search')}
              className={`view-button ${view === 'search' ? 'active' : ''}`}
            >
              Search Results
              {currentKeyword && ` (${currentKeyword})`}
            </button>
            <button
              onClick={() => handleViewChange('saved')}
              className={`view-button ${view === 'saved' ? 'active' : ''}`}
            >
              <Database size={16} />
              Saved Repositories
            </button>
          </div>

          {view === 'saved' && (
            <div className="sort-controls">
              <span className="sort-label">Sort by:</span>
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`sort-button ${sortBy === option.value ? 'active' : ''}`}
                >
                  {option.label}
                  {sortBy === option.value && (
                    sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="results-section">
          {isLoading ? (
            <Loading message={view === 'search' ? 'Searching repositories...' : 'Loading repositories...'} />
          ) : repositories.length > 0 ? (
            <>
              <div className="repositories-grid">
                {repositories.map((repository) => (
                  <RepositoryCard
                    key={repository._id}
                    repository={repository}
                    onDelete={handleDelete}
                    showDeleteButton={true}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.currentPage || 1}
                totalPages={pagination.totalPages || 1}
                totalCount={pagination.totalCount || 0}
                perPage={pagination.perPage || DEFAULT_PAGE_SIZE}
                onPageChange={handlePageChange}
                disabled={isLoading}
              />
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                {view === 'search' ? (
                  currentKeyword ? (
                    <>
                      <h3>No repositories found</h3>
                      <p>Try searching with different keywords</p>
                    </>
                  ) : (
                    <>
                      <h3>Start your search</h3>
                      <p>Enter a keyword above to search GitHub repositories</p>
                    </>
                  )
                ) : (
                  <>
                    <h3>No saved repositories</h3>
                    <p>Search and save repositories to see them here</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;