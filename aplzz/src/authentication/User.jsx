import React, { useState, useEffect } from 'react';
import { Card, Container, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../config/api';
import PostService from '../services/PostService';

const User = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { username } = useParams();
  const [userData, setUserData] = useState("");
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const navigate = useNavigate();

  const fetchPostsById = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PostService.fetchPostsById(username);
      setUserData(data);
    } catch (error) {
      console.error('Feil ved henting av innlegg:', error);
      setError('Kunne ikke hente innlegg');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsById();
  }, [username]);


  const handlePostDelete = async (postId) => {
    if (window.confirm('Er du sikker på at du vil slette dette innlegget?')) {
      try {
        const result = await PostService.deletePost(postId);
        if (result) {
          setPosts(posts.filter(post => post.postId !== postId));
          setError(null);
        }
      } catch (error) {
        console.error('Feil ved sletting av innlegg:', error);
        setError('Kunne ikke slette innlegget');
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) {
      setCommentError('Kommentaren kan ikke være tom');
      return;
    }

    try {
      const newComment = await PostService.addComment(postId, commentText);
      setPosts(posts.map(post => {
        if (post.postId === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), {
              ...newComment,
              text: commentText.trim(),
              commentId: Date.now(),
              getUser: { username: newComment.username },
              commentedAt: new Date()
            }]
          };
        }
        return post;
      }));

      setCommentText('');
      setCommentError('');
    } catch (error) {
      console.error('Feil ved posting av kommentar:', error);
      setCommentError('Kunne ikke legge til kommentar');
    }
  };

  const handleLike = async (postId) => {
    try {
      const data = await PostService.likePost(postId);
      setPosts(posts.map(post => {
        if (post.postId === postId) {
          return {
            ...post,
            likes: data.isLiked 
              ? [...(post.likes || []), { userId: data.userId }]
              : (post.likes || []).filter(like => like.userId !== data.userId)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Feil ved liking av innlegg:', error);
      setError('Kunne ikke like innlegget');
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="loading-spinner"></div>
    </div>
  );
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <Container className="py-4 bg-light min-vh-150 content-under-navbar">
      <p></p>
        <h1>{JSON.stringify(userData.getUserInfo?.username)}</h1>
    </Container>
  );
};

export default User;