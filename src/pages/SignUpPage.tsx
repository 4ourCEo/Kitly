
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpModal from '../components/SignUpModal';

const SignUpPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  if (!isOpen) {
    return null;
  }

  return <SignUpModal onClose={handleClose} onSwitchToLogin={handleSwitchToLogin} />;
};

export default SignUpPage;
