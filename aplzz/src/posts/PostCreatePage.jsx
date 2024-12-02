import React from 'react';
import { Container } from 'react-bootstrap';
import PostForm from './PostForm';
import API_URL from '../config/api';
import { Navigate } from 'react-router-dom';

const PostCreatePage = () => {
  const user = sessionStorage.getItem("user");
  if(!user) {
    return <Navigate to="/user/login" replace/>
  } else {
    var userValue = JSON.parse(user);
  }
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
    <Container className="py-4 content-under-navbar">
      <h2 className="mb-4">Nytt innlegg til {userValue.username}</h2>
      <PostForm onPostChanged={handlePostCreated} />
    </Container>
  );
};

export default PostCreatePage;