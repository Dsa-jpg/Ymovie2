import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UpdateChecker from './components/UpdateChecker';
import SideBar from './components/SideBar';

import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import AnimePage from './pages/AnimePage';
import SeriesPage from './pages/SeriesPage';
import FilmsPage from './pages/FilmsPage';

const App = () => {

  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <SideBar />
        <div style={{ padding: 20, flex: 1 }}>
          <UpdateChecker />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/films" element={<FilmsPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;