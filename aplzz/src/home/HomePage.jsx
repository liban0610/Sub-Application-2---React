import React from 'react';
import { Card, Container, Badge } from 'react-bootstrap';

const HomePage = () => {
  const posts = [
    {
      postId: 1,
      username: "JohnDoe",
      content: "Hadde en fantastisk dag på fjellet i dag! 🏔️",
      timestamp: "2024-03-20 14:30",
      likes: 20,
      imageUrl: "/images/scott.jpg"
    },
    {
      postId: 2,
      username: "JaneSmith",
      content: "Nydelig solnedgang over Oslo i kveld 🌅",
      timestamp: "2024-03-20 20:15",
      likes: 45,
      imageUrl: "/images/ai.jpg"
    }
  ];
  
  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-4">Aplzz</h1>
      </div>
      {posts.map(post => (
        <Card key={post.postId} className="mb-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card.Header className="d-flex justify-content-between align-items-center bg-white">
            <div className="fw-bold">{post.username}</div>
            <small className="text-muted">{post.timestamp}</small>
          </Card.Header>
          
          <Card.Img 
            variant="top" 
            src={post.imageUrl} 
            style={{ objectFit: 'cover', height: '300px' }}
          />
          
          <Card.Body>
            <Card.Text>{post.content}</Card.Text>
            <div className="d-flex justify-content-between align-items-center">
              <Badge bg="danger" className="px-3 py-2">
                {post.likes} ❤️
              </Badge>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm">Like</button>
                <button className="btn btn-outline-secondary btn-sm">Kommenter</button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default HomePage;