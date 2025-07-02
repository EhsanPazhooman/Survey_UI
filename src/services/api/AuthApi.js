import BaseAxios from "./BaseAxios";

/**
 * Auth API service
 */
const AuthApi = {
  /**
   * Admin Login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Admin username
   * @param {string} credentials.password - Admin password
   * @returns {Promise} API response with token and user data
   */
  async Login(credentials) {
    try {
      const response = await BaseAxios.post("/login", {
        username: credentials.username,
        password: credentials.password,
      });
      return response.data; // Return response.data instead of response
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Admin logout
   * @returns {Promise} API response
   */
  async logout() {
    try {
      const response = await BaseAxios.post("/logout");
      return response.data; // Return response.data
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Validate current JWT token by parsing it
   * @param {string} token - JWT token
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  validateToken(token) {
    try {
      if (!token) return null;

      // Simple JWT payload decode
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      // check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  },

  /**
   * Get User info from stored token
   * @param {string} token - JWT token
   * @returns {Object|null} User info from token
   */
  getUserFromToken(token) {
    const payload = this.validateToken(token);
    if (!payload) return null;

    return {
      id: payload.user_id,
      username: payload.username,
      group:
        payload[Object.keys(payload).find((key) => key.includes("groupsid"))] ||
        "User Group 01",
    };
  },

  /**
   * Handle authentication errors
   * @param {Error} error - The error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          return new Error(data.message || "Invalid credentials");
        case 403:
          return new Error("Access denied. Admin privileges required.");
        case 422:
          return new Error(data.message || "Validation failed");
        case 429:
          return new Error("Too many login attempts. Please try again later.");
        default:
          return new Error(data.message || "Login failed. Please try again.");
      }
    }

    if (error.request) {
      return new Error("Network error. Please check your connection.");
    }

    return new Error("An unexpected error occurred.");
  },
};

export default AuthApi;