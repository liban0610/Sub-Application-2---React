import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const PostForm = ({ onPostChanged, postId }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Innlegg må ha innhold');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await onPostChanged(formData);
      navigate('/');
    } catch (error) {
      setError('Kunne ikke opprette innlegg');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Innhold</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hva tenker du på?"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Bilde</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          accept="image/*"
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit">
          Publiser
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Avbryt
        </Button>
      </div>
    </Form>
  );
};

export default PostForm; 