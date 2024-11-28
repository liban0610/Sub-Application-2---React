import React, { useState, useEffect } from 'react';
import { Card, Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5214'

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
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

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.getUser?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostDelete = async (postId) => {
    if (window.confirm('Er du sikker på at du vil slette dette innlegget?')) {
      try {
        const response = await fetch(`${API_URL}/api/postapi/delete/${postId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Kunne ikke slette innlegget');
        }

        setPosts(posts.filter(post => post.postId !== postId));
      } catch (error) {
        console.error('Feil ved sletting av innlegg:', error);
        setError('Kunne ikke slette innlegget');
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-4">Aplzz</h1>
      </div>

      {/* Søk og opprett nytt innlegg */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3 align-items-center">
          <Form.Control
            type="search"
            placeholder="Søk i innlegg..."
            className="w-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="success"
            onClick={() => navigate('/posts/create')}
          >
            Nytt innlegg
          </Button>
        </div>
      </div>

      {/* Posts list */}
      <div>
        {filteredPosts.map(post => (
          <div key={post.postId}>
            <Card className="mb-4 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
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
                {post.userId === 1 && (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate(`/posts/update/${post.postId}`)}
                    >
                      Oppdater
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handlePostDelete(post.postId)}
                    >
                      Slett
                    </Button>
                  </div>
                )}
              </Card.Header>
              
              {post.imageUrl && (
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  backgroundColor: '#f8f9fa',
                  overflow: 'hidden'
                }}>
                  <Card.Img 
                    variant="top" 
                    src={`${API_URL}${post.imageUrl}`}
                    style={{ 
                      width: '100%',
                      display: 'block'
                    }}
                    onLoad={(e) => {
                      const img = e.target;
                      const naturalRatio = img.naturalWidth / img.naturalHeight;
                      const container = img.parentElement;
                      const maxHeight = 600;
                      const containerWidth = container.offsetWidth;
                      
                      if (naturalRatio > 1) {
                        // Bredere bilde
                        const height = containerWidth / naturalRatio;
                        container.style.height = `${Math.min(height, maxHeight)}px`;
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                      } else {
                        // Høyere bilde
                        container.style.height = `${Math.min(containerWidth * (1/naturalRatio), maxHeight)}px`;
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                      }
                    }}
                  />
                </div>
              )}
              
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
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center text-muted">
          Ingen innlegg funnet
        </div>
      )}
    </Container>
  );
};

export default HomePage;