import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from 'components';
import { Box } from '@chakra-ui/react';
import { Home, Login, Profile, Register, Feed, Settings } from 'pages';
import { AuthContext } from './components/AuthContext';

export const Routing = (): JSX.Element => {
  const { accessToken: token, user, isInitialized } = useContext(AuthContext);

  console.log('🛤 Routing Check (Updated):', { token, user, isInitialized });

  // ✅ Ensure routing does NOT run until AuthContext is initialized
  if (!isInitialized) {
    console.log('⏳ Waiting for AuthContext to fully initialize...');
    return <div>Loading...</div>; // ✅ Prevent incorrect routing
  }

  return (
    <Box w="100vw" h="100vh" position="relative">
      <Navbar />
      <Box as="main" mt="60px" w="100%" h="calc(100vh - 60px)" overflow="auto">
        <Routes>
          {/* ✅ Now, "/" will ONLY check authentication AFTER initialization */}
          <Route path="/" element={token && user ? <Feed /> : <Home />} />

          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile"
            element={token ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={token ? <Settings /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Box>
  );
};
