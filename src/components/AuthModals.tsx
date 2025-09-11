import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

interface AuthModalsProps {
  showLogin: boolean;
  showSignUp: boolean;
  onClose: () => void;
}

const AuthModals: React.FC<AuthModalsProps> = ({ showLogin, showSignUp, onClose }) => {
  const [isLoginVisible, setIsLoginVisible] = useState(showLogin);
  const [isSignUpVisible, setIsSignUpVisible] = useState(showSignUp);

  const handleSwitchToSignUp = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignUpVisible(false);
    setIsLoginVisible(true);
  };

  const handleClose = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(false);
    onClose();
  }

  if (!isLoginVisible && !isSignUpVisible) {
    return null;
  }

  return (
    <>
      {isLoginVisible && <LoginModal onClose={handleClose} onSwitchToSignUp={handleSwitchToSignUp} />}
      {isSignUpVisible && <SignUpModal onClose={handleClose} onSwitchToLogin={handleSwitchToLogin} />}
    </>
  );
};

export default AuthModals;