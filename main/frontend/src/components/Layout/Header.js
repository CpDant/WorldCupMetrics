import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import logo from '../assets/secondlogo.png';

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 17px;
    background-color: transparent;
`;

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    background: rgba(76, 175, 80, 0.85); 
    backdrop-filter: blur(10px); 
    border-radius: 15px;
    padding: 10px 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
    margin-right: 20px;
    border: 2px solid white;
    border-radius: 5px;

    img {
        height: 40px;
        width: auto;
        display: block;
        border: none;
        border-radius: 5px;
    }
`;

const Nav = styled.nav`
    display: flex;
    gap: 22px;
`;

const StyledNavLink = styled(NavLink)`
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    background: rgba(46, 125, 50, 0.85); 
    border-radius: 20px;
    font-size: 16px;
    font-weight: 500;
    transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        background: rgba(27, 94, 32, 0.85); 
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    &.active {
        background: rgba(27, 94, 32, 0.85); 
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
                    <StyledNavLink to="/metrics.html">Metrics</StyledNavLink>
                    <StyledNavLink to="/info.html">Info</StyledNavLink>
                </Nav>
            </HeaderContainer>
        </HeaderWrapper>
    );
};

export default Header;
