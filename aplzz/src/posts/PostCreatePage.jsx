import React from 'react';
import { Container } from 'react-bootstrap';
import PostForm from './PostForm';

const API_URL = 'http://localhost:5214';

const PostCreatePage = () => {
  const handlePostCreated = async (formData) => {
    formData.append('userId', '1');
    formData.append('createdAt', new Date().toISOString());

    const response = await fetch(`${API_URL}/api/postapi/create`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunne ikke opprette innlegg');
    }

    return await response.json();
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Nytt innlegg</h2>
      <PostForm onPostChanged={handlePostCreated} />
    </Container>
  );
};

export default PostCreatePage;