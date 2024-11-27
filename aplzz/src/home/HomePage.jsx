import React, { useState, useEffect } from 'react';
import { Card, Container, Badge } from 'react-bootstrap';

const API_URL = 'http://localhost:5214'

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/postapi/posts`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-4">Aplzz</h1>
      </div>
      {posts.map(post => (
        <Card key={post.postId} className="mb-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card.Header className="d-flex justify-content-between align-items-center bg-white">
            <div className="d-flex align-items-center">
              <img
                src={`${API_URL}/images/profile.jpg`}
                alt={post.getUser?.username}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  marginRight: '10px',
                  objectFit: 'cover'
                }}
              />
              <div>
                <div className="fw-bold">{post.getUser?.username}</div>
                <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
              </div>
            </div>
          </Card.Header>
          
          <Card.Img 
            variant="top" 
            src={`${API_URL}${post.imageUrl}`}
            style={{ objectFit: 'cover', height: '300px' }}
          />
          
          <Card.Body>
            <Card.Text>{post.content}</Card.Text>
            <div>
              <div className="d-flex gap-3 mb-2">
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-link p-0 text-danger text-decoration-none" 
                    style={{ fontSize: '1.1rem' }}
                  >
                    <span>{post.likes?.length || 0}</span>
                    <span className="ms-1">❤️</span>
                  </button>
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-link p-0 text-dark text-decoration-none" 
                    style={{ fontSize: '1.1rem' }}
                  >
                    <span>💬</span>
                  </button>
                </div>
              </div>
              <div className="text-muted mb-2">
                Kommentarer:
              </div>
              {post.comments && post.comments.map(comment => (
                <div key={comment.commentId} className="mb-2 ps-2 border-start">
                  <div className="d-flex justify-content-between">
                    <small className="fw-bold">{comment.getUser?.username}</small>
                    <small className="text-muted">
                      {new Date(comment.commentedAt).toLocaleString()}
                    </small>
                  </div>
                  <div>{comment.text}</div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default HomePage;