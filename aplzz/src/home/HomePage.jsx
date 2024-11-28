import React, { useState, useEffect } from 'react';
import { Card, Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import PostService from '../services/PostService';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const navigate = useNavigate();
  
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PostService.fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error('Feil ved henting av innlegg:', error);
      setError('Kunne ikke hente innlegg');
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
        await PostService.deletePost(postId);
        setPosts(posts.filter(post => post.postId !== postId));
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <Container className="py-4 bg-light min-vh-100">
      {/* Header med gradient bakgrunn */}
      <div className="text-center mb-5 py-5 bg-gradient-primary rounded shadow-sm">
        <h1 className="display-3 fw-bold text-white mb-2">Aplzz</h1>
        <p className="lead text-white-50 mb-0 fs-4">Del dine tanker med verden</p>
      </div>

      {/* Søk og opprett nytt innlegg */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <div className="d-flex gap-3 align-items-center flex-grow-1 me-3">
          <Form.Control
            type="search"
            placeholder="Søk i innlegg..."
            className="shadow-sm border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="primary"
          onClick={() => navigate('/posts/create')}
          className="shadow-sm px-4 py-2"
        >
          <i className="bi bi-plus-lg me-2"></i>Nytt innlegg
        </Button>
      </div>

      {/* Posts list med forbedret styling */}
      <div className="posts-container">
        {filteredPosts.map(post => (
          <Card key={post.postId} className="mb-4 shadow-sm border-0 overflow-hidden">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white border-0 py-3">
              <div className="d-flex align-items-center">
                <div className="rounded-circle overflow-hidden me-3 shadow-sm" style={{ width: '45px', height: '45px' }}>
                  <img
                    src={`${API_URL}/images/profile.jpg`}
                    alt={post.getUser?.username}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">{post.getUser?.username}</h6>
                  <small className="text-muted">
                    {new Date(post.createdAt).toLocaleString('no-NO', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
              </div>
              {post.userId === 1 && (
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => navigate(`/posts/update/${post.postId}`)}
                  >
                    <i className="bi bi-pencil me-1"></i>Rediger
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => handlePostDelete(post.postId)}
                  >
                    <i className="bi bi-trash me-1"></i>Slett
                  </Button>
                </div>
              )}
            </Card.Header>
            
            {post.imageUrl && (
              <div className="post-image-container bg-light">
                <Card.Img 
                  variant="top" 
                  src={`${API_URL}${post.imageUrl}`}
                  className="img-fluid"
                  style={{ maxHeight: '600px', objectFit: 'contain' }}
                />
              </div>
            )}
            
            <Card.Body className="px-4">
              <Card.Text className="mb-4">{post.content}</Card.Text>
              
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleLike(post.postId)}
                  >
                    <span className="me-2 fs-5">
                      {post.likes?.some(like => like.userId === 1) ? '❤️' : '🤍'}
                    </span>
                    <span className="text-muted">{post.likes?.length || 0} liker dette</span>
                  </button>
                  <small className="text-muted">
                    {post.comments?.length || 0} kommentarer
                  </small>
                </div>

                {/* Kommentarseksjon */}
                <div className="comments-section bg-light rounded p-3">
                  {post.comments && post.comments.map(comment => (
                    <div key={comment.commentId} className="comment mb-3 border-bottom pb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <span className="fw-bold me-2">{comment.getUser?.username}</span>
                          <span>{comment.text}</span>
                        </div>
                        <small className="text-muted ms-2">
                          {new Date(comment.commentedAt).toLocaleString('no-NO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>
                  ))}

                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddComment(post.postId);
                  }} className="mt-3">
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Skriv en kommentar..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="border-0 shadow-sm"
                      />
                      <Button 
                        variant="primary" 
                        type="submit" 
                        className="px-4"
                      >
                        Send
                      </Button>
                    </div>
                    {commentError && (
                      <Form.Text className="text-danger">{commentError}</Form.Text>
                    )}
                  </Form>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox display-1"></i>
            <p className="mt-3">Ingen innlegg funnet</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default HomePage;