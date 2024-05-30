// src/components/Layout/Header.js

import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import logo from '../assets/secondlogo.png';

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
    padding: 5px 30px;
`;

const Logo = styled.div`
    margin-right: 40px;
    padding: 3px; // componente bordo
    border: 2px solid white; // componente bordo
    border-radius: 5px; // componente bordo

    img {
        height: 35px;
        width: auto;
        display: block; //componente bordo
    }
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
                <Logo>
                    <img src={logo} alt="Logo" />
                </Logo>
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
