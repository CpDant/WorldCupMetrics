// src/components/Layout/MainLayout.js

import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const PageContainer = styled.div`
  background-image: url('/background.jpg');
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Box = styled.div`
  width: 90%;
  max-width: 1200px;
  min-height: 500px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const MainLayout = ({ children }) => {
  return (
    <PageContainer>
      <Header />
      <Content>
        <Box>{children}</Box>
      </Content>
    </PageContainer>
  );
};

export default MainLayout;
