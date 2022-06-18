import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io, Socket } from 'socket.io-client';

import { ConfigProvider } from './hooks/useConfig.js';
import { HomePage } from './pages/HomePage.js';

export const App = () => {
  return (
    <BrowserRouter basename="/hijacker">
      <ConfigProvider>
        <h1>Hijacker</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="testing" element={<div>testing</div>} />
          <Route path="hello" element={<div>hello</div>} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
};