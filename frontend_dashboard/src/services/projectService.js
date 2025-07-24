import api from './authService';

export const projectService = {
  // PUBLIC_INTERFACE
  /**
   * Get all projects accessible to the authenticated user
   * @returns {Promise<Object>} Projects response with list of projects
   */
  async getProjects() {
    try {
      const response = await api.get('/projects/');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch projects';
      throw new Error(errorMessage);
    }
  },

  // PUBLIC_INTERFACE
  /**
   * Get detailed information for a specific project
   * @param {string} projectKey - The project key
   * @returns {Promise<Object>} Project details
   */
  async getProjectDetails(projectKey) {
    try {
      const response = await api.get(`/projects/${projectKey}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch project details';
      throw new Error(errorMessage);
    }
  }
};
