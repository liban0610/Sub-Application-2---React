import React, { useState, useEffect } from 'react';
import { Card, Container, Form, ButtonGroup, Button, Carousel } from 'react-bootstrap';

const API_URL = 'http://localhost:5214'

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' eller 'list'
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Filter posts basert på søk
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.getUser?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Velg ut de 3 første postene for carousel
  const featuredPosts = posts.slice(0, 3);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-4">Aplzz</h1>
      </div>

      {/* Søk og visningsvalg */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Control
          type="search"
          placeholder="Søk i innlegg..."
          className="w-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ButtonGroup>
          <Button 
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('list')}
          >
            Liste
          </Button>
        </ButtonGroup>
      </div>

      {/* Carousel for fremhevede innlegg */}
      {searchQuery === '' && (
        <Carousel className="mb-4">
          {featuredPosts.map(post => (
            <Carousel.Item key={post.postId}>
              <img
                className="d-block w-100"
                src={`${API_URL}${post.imageUrl}`}
                alt={post.content}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <Carousel.Caption>
                <h3>{post.getUser?.username}</h3>
                <p>{post.content}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* Posts grid/list */}
      <div className={viewMode === 'grid' ? 'row g-4' : ''}>
        {filteredPosts.map(post => (
          <div key={post.postId} className={viewMode === 'grid' ? 'col-md-6 col-lg-4' : ''}>
            <Card className={`mb-4 shadow-sm ${viewMode === 'list' ? 'mx-auto' : ''}`} 
                  style={viewMode === 'list' ? { maxWidth: '600px' } : {}}>
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