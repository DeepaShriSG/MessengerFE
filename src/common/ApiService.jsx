import axios from "axios";

// Create an Axios instance with a predefined base URL and default headers
const AxiosService = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // Base URL for API requests, loaded from environment variables
  headers: {
    'Content-Type': 'application/json' // Default content type for requests
  }
});

// Add a request interceptor to include the Authorization header with token
AxiosService.interceptors.request.use((config) => {
  // Retrieve the token from session storage
  const token = sessionStorage.getItem("token");

  // If a token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Return the modified config object
  return config;
}, (error) => {
  // Handle request error
  return Promise.reject(error);
});

// Export the Axios instance for use in other parts of the application
export default AxiosService;
