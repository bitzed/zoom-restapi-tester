// Zoom API Specification Index
// Combines all category specs into one unified spec

const ZOOM_API_SPEC = {
  info: {
    title: "Zoom API",
    version: "2.0.0",
    baseUrl: "https://api.zoom.us/v2"
  },
  groups: [
    {
      name: "Workplace",
      categories: []
    },
    {
      name: "Business Services",
      categories: []
    },
    {
      name: "Accounts",
      categories: []
    },
    {
      name: "Build Platform",
      categories: []
    },
    {
      name: "Marketplace",
      categories: []
    }
  ],
  categories: [] // Flattened categories for backward compatibility
};

// Function to register a category
function registerCategory(groupName, category) {
  const group = ZOOM_API_SPEC.groups.find(g => g.name === groupName);
  if (group) {
    group.categories.push(category);
  }
  ZOOM_API_SPEC.categories.push(category);
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.ZOOM_API_SPEC = ZOOM_API_SPEC;
  window.registerCategory = registerCategory;
}
