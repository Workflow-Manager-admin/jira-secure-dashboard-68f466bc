import React from 'react';
import './ProjectCard.css';

// PUBLIC_INTERFACE
function ProjectCard({ project }) {
  // PUBLIC_INTERFACE
  const formatDate = (dateString) => {
    if (!dateString) return 'No recent activity';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // PUBLIC_INTERFACE
  const getProjectTypeDisplay = (typeKey) => {
    const typeMap = {
      'software': 'Software',
      'business': 'Business',
      'service_desk': 'Service Desk',
      'product_discovery': 'Product Discovery'
    };
    return typeMap[typeKey] || typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-avatar">
          {project.avatarUrl ? (
            <img src={project.avatarUrl} alt={`${project.name} avatar`} />
          ) : (
            <div className="default-avatar">
              {project.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="project-title">
          <h3>{project.name}</h3>
          <span className="project-key">{project.key}</span>
        </div>
      </div>

      <div className="project-info">
        <div className="info-row">
          <span className="info-label">Type:</span>
          <span className="info-value">{getProjectTypeDisplay(project.projectTypeKey)}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Lead:</span>
          <div className="lead-info">
            <span className="lead-name">{project.lead?.name || 'Unknown'}</span>
            {project.lead?.email && (
              <span className="lead-email">{project.lead.email}</span>
            )}
          </div>
        </div>

        {project.description && (
          <div className="project-description">
            <p>{project.description}</p>
          </div>
        )}
      </div>

      <div className="project-details">
        {project.issueTypes && project.issueTypes.length > 0 && (
          <div className="issue-types">
            <span className="section-label">Issue Types:</span>
            <div className="issue-type-list">
              {project.issueTypes.slice(0, 4).map((issueType) => (
                <div key={issueType.id} className="issue-type-item">
                  {issueType.iconUrl && (
                    <img src={issueType.iconUrl} alt={issueType.name} className="issue-type-icon" />
                  )}
                  <span className="issue-type-name">{issueType.name}</span>
                </div>
              ))}
              {project.issueTypes.length > 4 && (
                <div className="issue-type-more">
                  +{project.issueTypes.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="project-footer">
          <div className="last-updated">
            <span className="section-label">Last Updated:</span>
            <span className="date-value">{formatDate(project.lastUpdated)}</span>
          </div>
          
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              title="Open in Jira"
            >
              <span>Open →</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
