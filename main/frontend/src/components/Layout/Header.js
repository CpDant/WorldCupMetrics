// src/components/Layout/Header.js

import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: #4CAF50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const Logo = styled.div`
  font-size: 1.5em;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  background-color: #2E7D32;
  border-radius: 5px;

  &:hover {
    background-color: #1B5E20;
  }

  &.active {
    background-color: #1B5E20;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>WorldMetrics</Logo>
      <Nav>
        <StyledNavLink to="/" end>Home</StyledNavLink>
        <StyledNavLink to="/crud">CRUD</StyledNavLink>
        <StyledNavLink to="/info">Info</StyledNavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
