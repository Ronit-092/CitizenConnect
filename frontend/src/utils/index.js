// Utility functions for the application

export function createPageUrl(pageName) {
  // Convert page names to URL paths
  const pageMap = {
    'CitizenDashboard': '/citizen-dashboard',
    'CitizenSignup': '/citizen-signup',
    'FileComplaint': '/file-complaint',
    'GovtDashboard': '/govt-dashboard',
    'Home': '/'
  };
  
  return pageMap[pageName] || '/';
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}