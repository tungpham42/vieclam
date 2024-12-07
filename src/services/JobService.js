import axios from "axios";

const API_URL = "https://remotive.io/api/remote-jobs";

// Function to fetch jobs and paginate using array slicing
export const fetchJobs = async (
  searchTerm = "",
  page = 1,
  category = "",
  limit = 12
) => {
  try {
    // Fetch all jobs from the API
    const response = await axios.get(API_URL, {
      params: {
        search: searchTerm,
        category: category,
      },
    });

    const jobs = response.data?.jobs || []; // Assuming response.data.jobs contains the jobs array

    // Calculate start and end indices for slicing
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice the jobs array for the current page
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      totalJobs: jobs.length,
      totalPages: Math.ceil(jobs.length / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Function to fetch job filters (categories)
export const fetchJobFilters = async () => {
  try {
    const response = await axios.get(API_URL);
    const categories = new Set();

    response.data.jobs.forEach((job) => {
      if (job.category) categories.add(job.category);
    });

    // Convert the Set to an array and sort it alphabetically
    const sortedCategories = [...categories].sort();

    return {
      categories: sortedCategories,
    };
  } catch (error) {
    console.error("Error fetching job filters:", error);
    throw error;
  }
};
