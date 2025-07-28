import { invoke } from '@tauri-apps/api/core';

/**
 * Search for apps on Flathub
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of simplified app objects
 */
export async function searchApps(query) {
  try {
    console.log('Searching for:', query);
    
    const results = await invoke('search_apps', { query });
    console.log('Search results from Rust:', results);
    
    return results || [];
    
  } catch (error) {
    console.error('Error searching apps:', error);
    
    // Re-throw with more specific error types
    if (error.message && error.message.includes('Request failed')) {
      if (error.message.includes('timeout')) {
        throw new Error('Request timeout: The search took too long to complete');
      } else if (error.message.includes('dns')) {
        throw new Error('Network error: Unable to connect to Flathub');
      } else {
        throw new Error('Network error: Failed to connect to the server');
      }
    } else if (error.message && error.message.includes('JSON parsing')) {
      throw new Error('Server error: Invalid response from server');
    } else {
      throw new Error(error.message || 'An unexpected error occurred while searching');
    }
  }
}

/**
 * Get detailed information about a specific app
 * @param {string} appId - The app ID to get details for
 * @returns {Promise<Object>} Detailed app information
 */
export async function getAppDetails(appId) {
  try {
    console.log('Fetching app details for:', appId);
    
    const details = await invoke('get_app_details', { appId });
    console.log('App details from Rust:', details);
    
    return details;
    
  } catch (error) {
    console.error('Error fetching app details:', error);
    
    // Re-throw with more specific error types
    if (error.message && error.message.includes('Request failed')) {
      if (error.message.includes('timeout')) {
        throw new Error('Request timeout: The request took too long to complete');
      } else if (error.message.includes('dns')) {
        throw new Error('Network error: Unable to connect to Flathub');
      } else {
        throw new Error('Network error: Failed to connect to the server');
      }
    } else if (error.message && error.message.includes('JSON parsing')) {
      throw new Error('Server error: Invalid response from server');
    } else {
      throw new Error(error.message || 'An unexpected error occurred while fetching app details');
    }
  }
}
