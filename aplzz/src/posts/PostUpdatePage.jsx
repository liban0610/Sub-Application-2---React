import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PostForm from './PostForm';
import API_URL from '../config/api';

const PostUpdatePage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/postapi/${postId}`);
        if (!response.ok) {
          throw new Error('Kunne ikke hente innlegget');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError('Kunne ikke hente innlegget');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handlePostUpdated = async (formData) => {
    formData.append('postId', postId);
    
    const response = await fetch(`${API_URL}/api/postapi/update/${postId}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kunne ikke oppdatere innlegg');
    }

    return await response.json();
  };

  if (loading) return <div className="text-center">Laster...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!post) return <div className="text-center">Fant ikke innlegget</div>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Oppdater innlegg</h2>
      <PostForm 
        onPostChanged={handlePostUpdated} 
        postId={post.postId} 
        isUpdate={true} 
        initialData={post} 
      />
    </Container>
  );
};

export default PostUpdatePage; 