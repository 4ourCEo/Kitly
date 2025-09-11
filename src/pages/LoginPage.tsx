
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const LoginPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  const handleSwitchToSignUp = () => {
    navigate('/signup');
  };

  if (!isOpen) {
    return null;
  }

  return <LoginModal onClose={handleClose} onSwitchToSignUp={handleSwitchToSignUp} />;
};

export default LoginPage;
