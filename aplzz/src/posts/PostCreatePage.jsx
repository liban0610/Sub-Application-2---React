import React from 'react';
import { Container } from 'react-bootstrap';
import PostForm from './PostForm';
import API_URL from '../config/api';
const user = sessionStorage.getItem("user")
var userVl = JSON.parse(user);
const PostCreatePage = () => {
  if(!user) {
    // login first
    window.location.href = "/user/login";
  }
  const handlePostCreated = async (formData) => {
    formData.append('userId', userVl.id);
    formData.append('createdAt', new Date().toISOString());
    try{
      const response = await fetch(`${API_URL}/api/postapi/create`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunne ikke opprette innlegg');
    }

    return await response.json();
  }catch(error){
    console.error('A probelem with the post creation: ',error);
  }

};

  return (
    <Container className="py-4 content-under-navbar">
      <h2 className="mb-4">Nytt innlegg</h2>
      <PostForm onPostChanged={handlePostCreated} />
    </Container>
  );
};

export default PostCreatePage;