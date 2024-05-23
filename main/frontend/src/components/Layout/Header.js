// src/components/Layout/Header.js

import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: transparent;
`;

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  background-color: #4CAF50;
  border-radius: 10px;
  padding: 8px 50px;
`;

const Logo = styled.div`
  font-size: 1.5em;
  color: white;
  margin-right: 30px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px;
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
    <HeaderWrapper>
      <HeaderContainer>
        <Logo>WorldCupMetrics</Logo>
        <Nav>
          <StyledNavLink to="/" end>Home</StyledNavLink>
          <StyledNavLink to="/crud.html">CRUD</StyledNavLink>
          <StyledNavLink to="/info.html">Info</StyledNavLink>
        </Nav>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
