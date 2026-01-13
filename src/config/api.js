// Centralized API configuration with environment detection
const getApiBaseUrl = () => {
  // Check if we have an explicit environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on current environment
  const currentHost = window.location.hostname;
  
  // Production detection
  if (currentHost.includes('netlify.app') || currentHost.includes('vercel.app') || currentHost !== 'localhost') {
    // For production, we need a deployed backend
    // This is a temporary fallback - you should deploy your backend and update this
    console.warn('🚨 Production environment detected but no backend URL configured!');
    console.warn('Please deploy your backend and set VITE_API_BASE_URL environment variable.');
    
    // Return a placeholder that will show clear error messages
    return 'https://backend-not-deployed.placeholder';
  }
  
  // Development fallback
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs with error handling
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL;
  
  // Check if we're in production with no backend
  if (baseUrl.includes('placeholder')) {
    console.error('❌ Backend not deployed! Please follow the deployment guide.');
    return baseUrl; // This will cause a clear error
  }
  
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Enhanced fetch wrapper with better error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  // Check for placeholder URL
  if (url.includes('placeholder')) {
    throw new Error('Backend server not deployed. Please deploy your backend server first.');
  }
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      console.error('🚨 Network Error: Cannot connect to backend server');
      console.error('Current API URL:', url);
      console.error('Possible causes:');
      console.error('1. Backend server is not running');
      console.error('2. CORS configuration issue');
      console.error('3. Backend URL is incorrect');
      throw new Error('Cannot connect to backend server. Please check deployment.');
    }
    throw error;
  }
};

// Log current configuration for debugging
console.log('🔧 API Configuration:', {
  environment: import.meta.env.MODE,
  hostname: window.location.hostname,
  apiBaseUrl: API_BASE_URL,
  isProduction: !window.location.hostname.includes('localhost')
});

export default {
  API_BASE_URL,
  buildApiUrl,
  apiCall
};