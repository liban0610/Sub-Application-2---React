import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import HomePage from './home/HomePage';
import NavMenu from './shared/NavMenu';
import PostCreatePage from './posts/PostCreatePage.jsx';
import PostUpdatePage from './posts/PostUpdatePage.jsx';

function App() {
  return (
    <Container>
      <NavMenu />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/create" element={<PostCreatePage />} />
          <Route path="/posts/update/:postId" element={<PostUpdatePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;