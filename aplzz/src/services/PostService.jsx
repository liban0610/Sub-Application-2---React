import API_URL from '../config/api';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Noe gikk galt');
  }
  return response.json();
};

const PostService = {
  fetchPosts: async () => {
    const response = await fetch(`${API_URL}/api/postapi/posts`);
    return handleResponse(response);
  },
  fetchPostsById: async () => {
    const response = await fetch(`${API_URL}/api/postapi/posts`);
    return handleResponse(response);
  },
  createPost: async (formData) => {
    const response = await fetch(`${API_URL}/api/postapi/create`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(response);
  },

  updatePost: async (postId, formData) => {
    const response = await fetch(`${API_URL}/api/postapi/update/${postId}`, {
      method: 'PUT',
      body: formData
    });
    return handleResponse(response);
  },

  deletePost: async (postId) => {
    const response = await fetch(`${API_URL}/api/postapi/delete/${postId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Kunne ikke slette innlegget');
    }
    
    if (response.status === 204) {
      return true;
    }
    
    return response.json();
  },

  addComment: async (postId, commentText) => {
    const response = await fetch(`${API_URL}/api/postapi/addcomment`, {
      method: 'POST',
      headers,
      body: `postId=${postId}&commentText=${encodeURIComponent(commentText.trim())}`
    });
    return handleResponse(response);
  },

  likePost: async (postId) => {
    const response = await fetch(`${API_URL}/api/postapi/likepost`, {
      method: 'POST',
      headers,
      body: `postId=${postId}`
    });
    return handleResponse(response);
  },

  getPostById: async (postId) => {
    const response = await fetch(`${API_URL}/api/postapi/${postId}`);
    return handleResponse(response);
  }
};

export default PostService; 