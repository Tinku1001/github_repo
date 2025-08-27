import React, { useState } from 'react';
import { Star, GitFork, ExternalLink, Calendar, User, X, Trash2, AlertTriangle } from 'lucide-react';

const RepositoryCard = ({ repository, onDelete, showDeleteButton = true }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
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

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(repository._id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
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
            <button 
              onClick={handleDeleteClick} 
              className="delete-button" 
              title="Remove from saved"
            >
              <Trash2 size={16} />
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

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="modal-overlay" onClick={handleCancelDelete}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-icon">
                  <AlertTriangle size={24} />
                </div>
                <button 
                  className="modal-close-button" 
                  onClick={handleCancelDelete}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-content">
                <h3 className="modal-title">Remove Repository</h3>
                <p className="modal-message">
                  Are you sure you want to remove <strong>{fullName}</strong> from your saved repositories? This action cannot be undone.
                </p>
                
                <div className="repo-preview">
                  <div className="repo-preview-header">
                    <span className="repo-preview-name">{fullName}</span>
                    {language && (
                      <span className="repo-preview-language">
                        <span 
                          className="language-dot-small" 
                          style={{ backgroundColor: getLanguageColor(language) }}
                        ></span>
                        {language}
                      </span>
                    )}
                  </div>
                  {description && (
                    <p className="repo-preview-description">{description.slice(0, 80)}...</p>
                  )}
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="modal-cancel-button" 
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button 
                  className="modal-confirm-button" 
                  onClick={handleConfirmDelete}
                >
                  <Trash2 size={16} />
                  Remove Repository
                </button>
              </div>
            </div>
          </div>
          
          <style jsx>{`
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              animation: fadeIn 0.2s ease-out;
            }
            
            @keyframes fadeIn {
              from { 
                opacity: 0; 
              }
              to { 
                opacity: 1; 
              }
            }
            
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            .delete-modal {
              background: white;
              border-radius: 20px;
              box-shadow: 
                0 20px 50px rgba(0, 0, 0, 0.3),
                0 8px 32px rgba(0, 0, 0, 0.2);
              max-width: 480px;
              width: 90%;
              margin: 20px;
              animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              border: 1px solid #e2e8f0;
              overflow: hidden;
            }
            
            .modal-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 24px 24px 0 24px;
            }
            
            .modal-icon {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #e53e3e;
              animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }
            
            .modal-close-button {
              background: none;
              border: none;
              color: #718096;
              cursor: pointer;
              padding: 8px;
              border-radius: 8px;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .modal-close-button:hover {
              background: #f7fafc;
              color: #4a5568;
            }
            
            .modal-content {
              padding: 20px 24px;
            }
            
            .modal-title {
              font-size: 1.25rem;
              font-weight: 700;
              color: #2d3748;
              margin: 0 0 12px 0;
            }
            
            .modal-message {
              color: #4a5568;
              line-height: 1.6;
              margin: 0 0 20px 0;
              font-size: 0.95rem;
            }
            
            .repo-preview {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 4px;
            }
            
            .repo-preview-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            
            .repo-preview-name {
              font-weight: 600;
              color: #2d3748;
              font-size: 0.9rem;
            }
            
            .repo-preview-language {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 0.8rem;
              color: #718096;
              font-weight: 500;
            }
            
            .language-dot-small {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              display: inline-block;
            }
            
            .repo-preview-description {
              color: #718096;
              font-size: 0.85rem;
              line-height: 1.4;
              margin: 0;
            }
            
            .modal-actions {
              display: flex;
              gap: 12px;
              padding: 0 24px 24px 24px;
              justify-content: flex-end;
            }
            
            .modal-cancel-button {
              padding: 12px 20px;
              border: 1px solid #e2e8f0;
              background: white;
              color: #4a5568;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              font-size: 0.9rem;
            }
            
            .modal-cancel-button:hover {
              background: #f7fafc;
              border-color: #cbd5e0;
            }
            
            .modal-confirm-button {
              padding: 12px 20px;
              border: none;
              background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
              color: white;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.9rem;
              box-shadow: 0 4px 14px rgba(229, 62, 62, 0.4);
            }
            
            .modal-confirm-button:hover {
              background: linear-gradient(135deg, #c53030 0%, #9c2626 100%);
              transform: translateY(-1px);
              box-shadow: 0 6px 20px rgba(229, 62, 62, 0.5);
            }
            
            .modal-confirm-button:active {
              transform: translateY(0);
            }
            
            @media (max-width: 480px) {
              .delete-modal {
                margin: 10px;
                width: calc(100% - 20px);
              }
              
              .modal-actions {
                flex-direction: column-reverse;
              }
              
              .modal-cancel-button,
              .modal-confirm-button {
                width: 100%;
                justify-content: center;
              }
            }
          `}</style>
        </>
      )}
    </>
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