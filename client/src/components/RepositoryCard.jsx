import React from 'react';
import { Star, GitFork, ExternalLink, Calendar, User } from 'lucide-react';

const RepositoryCard = ({ repository, onDelete, showDeleteButton = true }) => {
  const {
    name,
    fullName,
    description,
    htmlUrl,
    stargazersCount,
    forksCount,
    language,
    owner,
    createdAt,
    updatedAt
  } = repository;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this repository from your saved list?')) {
      onDelete(repository._id);
    }
  };

  return (
    <div className="repository-card">
      <div className="repository-header">
        <div className="repository-title">
          <h3 className="repository-name">
            <a href={htmlUrl} target="_blank" rel="noopener noreferrer">
              {fullName}
            </a>
          </h3>
          <a href={htmlUrl} target="_blank" rel="noopener noreferrer" className="external-link">
            <ExternalLink size={16} />
          </a>
        </div>
        {showDeleteButton && (
          <button onClick={handleDelete} className="delete-button" title="Remove from saved">
            ×
          </button>
        )}
      </div>

      {description && (
        <p className="repository-description">{description}</p>
      )}

      <div className="repository-stats">
        <div className="stat-item">
          <Star size={16} />
          <span>{stargazersCount.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <GitFork size={16} />
          <span>{forksCount.toLocaleString()}</span>
        </div>
        {language && (
          <div className="stat-item language">
            <span className="language-dot" style={{ backgroundColor: getLanguageColor(language) }}></span>
            <span>{language}</span>
          </div>
        )}
      </div>

      <div className="repository-footer">
        <div className="owner-info">
          <User size={16} />
          <img src={owner.avatarUrl} alt={owner.login} className="owner-avatar" />
          <a href={owner.htmlUrl} target="_blank" rel="noopener noreferrer" className="owner-name">
            {owner.login}
          </a>
        </div>
        <div className="date-info">
          <Calendar size={16} />
          <span title={`Added: ${formatDate(createdAt)}`}>
            {formatDate(updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper function for language colors
const getLanguageColor = (language) => {
  const colors = {
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Java': '#b07219',
    'TypeScript': '#2b7489',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#239120',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Scala': '#c22d40',
    'Shell': '#89e051',
    'HTML': '#e34c26',
    'CSS': '#563d7c'
  };
  return colors[language] || '#586069';
};

export default RepositoryCard;