import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/Home';
import Crud from './components/Pages/Crud';
import Info from './components/Pages/Info';
import Metrics from './components/Pages/Metrics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/crud.html" element={<Crud />} />
          <Route path="/info.html" element={<Info />} />
          <Route path="/metrics.html" element={<Metrics />} />
      </Routes>
    </Router>
  );
}

export default App;