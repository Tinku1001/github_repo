import React, { useState, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchForm = ({ onSearch, isLoading, searchHistory = [] }) => {
  const [keyword, setKeyword] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
      setShowHistory(false);
    }
  }, [keyword, onSearch]);

  const handleHistoryClick = (historyKeyword) => {
    setKeyword(historyKeyword);
    onSearch(historyKeyword);
    setShowHistory(false);
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search GitHub repositories..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            className="search-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !keyword.trim()}
            className="search-button"
          >
            <Search size={20} />
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {showHistory && searchHistory.length > 0 && (
          <div className="search-history">
            <div className="search-history-header">
              <Filter size={16} />
              <span>Recent Searches</span>
            </div>
            <ul className="search-history-list">
              {searchHistory.map((item, index) => (
                <li 
                  key={index}
                  onClick={() => handleHistoryClick(item._id)}
                  className="search-history-item"
                >
                  <span>{item._id}</span>
                  <small>{item.count} results</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;