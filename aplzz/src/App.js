import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import HomePage from './home/HomePage';
import NavMenu from './shared/NavMenu';
import Cookies from 'js-cookie';
import PostCreatePage from './posts/PostCreatePage.jsx';
import PostUpdatePage from './posts/PostUpdatePage.jsx';
import Login from './authentication/Login.jsx';
import Register from './authentication/Register.jsx';
import User from './authentication/User.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Container>
        <NavMenu />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/create" element={<PostCreatePage />} />
          <Route path="/posts/update/:postId" element={<PostUpdatePage />} />
          <Route path="/user/Login" element={<Login />} />
          <Route path="/user/Register" element={<Register />} />
          <Route path="/profile/:username" element={<User />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;