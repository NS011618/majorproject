import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { logoutRoute } from '../utils/APIRoutes';

const Logout = () => {
  const navigate = useNavigate();

  const performLogout = async () => {
    try {
      const response = await axios.post(logoutRoute);

      if (response.status === 200) {
        localStorage.setItem('isLoggedIn', 'false');
        navigate('/login-page');
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

 

  const handleLogoutClick = async () => {   
    await performLogout();
  };

  return (
    <Container>
      <LogoutForm>
        <h1>Logout</h1>
        {/* Update the onClick handler */}
        <Button onClick={handleLogoutClick}>Log out</Button>
        <Link to="/login-page">Back to Login</Link>
      </LogoutForm>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LogoutForm = styled.div`
  text-align: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
`;

const Button = styled.button`
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  background-color: #dc3545; /* Use a color that represents logout */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer; /* Use pointer to indicate the button is clickable */
`;

export default Logout;
