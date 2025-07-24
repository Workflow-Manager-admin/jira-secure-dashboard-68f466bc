import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';
import './LoginPage.css';

// PUBLIC_INTERFACE
function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    jira_domain: '',
    api_token: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { user, login } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // PUBLIC_INTERFACE
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Domain validation
    if (!credentials.jira_domain.trim()) {
      newErrors.jira_domain = 'Jira domain is required';
    } else if (credentials.jira_domain.length < 3) {
      newErrors.jira_domain = 'Domain must be at least 3 characters';
    }

    // API token validation
    if (!credentials.api_token.trim()) {
      newErrors.api_token = 'API token is required';
    } else if (credentials.api_token.length < 10) {
      newErrors.api_token = 'API token must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('');
    }
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      await login(credentials);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Jira Dashboard</h1>
          <p>Sign in with your Jira credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {submitError && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {submitError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="your.email@company.com"
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="jira_domain">Jira Domain</label>
            <input
              type="text"
              id="jira_domain"
              name="jira_domain"
              value={credentials.jira_domain}
              onChange={handleInputChange}
              className={errors.jira_domain ? 'error' : ''}
              placeholder="yourcompany.atlassian.net"
              disabled={loading}
            />
            {errors.jira_domain && <span className="error-text">{errors.jira_domain}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="api_token">API Token</label>
            <input
              type="password"
              id="api_token"
              name="api_token"
              value={credentials.api_token}
              onChange={handleInputChange}
              className={errors.api_token ? 'error' : ''}
              placeholder="Your Jira API token"
              disabled={loading}
            />
            {errors.api_token && <span className="error-text">{errors.api_token}</span>}
            <small className="help-text">
              Generate your API token from{' '}
              <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer">
                Atlassian Account Settings
              </a>
            </small>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
