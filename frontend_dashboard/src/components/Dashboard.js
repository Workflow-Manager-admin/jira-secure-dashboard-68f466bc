import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { projectService } from '../services/projectService';
import ProjectCard from './ProjectCard';
import './Dashboard.css';

// PUBLIC_INTERFACE
function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { user, logout } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  // PUBLIC_INTERFACE
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectService.getProjects();
      setProjects(response.projects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // PUBLIC_INTERFACE
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Jira Dashboard</h1>
            <p>Welcome, {user?.email}</p>
          </div>
          <div className="header-right">
            <button onClick={handleLogout} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="projects-count">
              {filteredProjects.length} of {projects.length} projects
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
                <button onClick={loadProjects} className="retry-button">
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredProjects.length === 0 && searchTerm && (
            <div className="no-results">
              <p>No projects found matching "{searchTerm}"</p>
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="no-projects">
              <p>No projects found. Make sure you have access to Jira projects.</p>
            </div>
          )}

          {!loading && !error && filteredProjects.length > 0 && (
            <div className="projects-grid">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
