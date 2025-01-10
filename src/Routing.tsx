import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from 'components';
import { Box } from '@chakra-ui/react';

import { Home, Login, Profile, Register, Feed, Settings } from 'pages';
import { AuthContext } from './components/AuthContext';

export const Routing = (): JSX.Element => {
  const { accessToken: token } = useContext(AuthContext);

  return (
    <Box w="100vw" h="100vh" position="relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box
        as="main"
        mt="60px" /* Push content below the Navbar */
        w="100%"
        h="calc(100vh - 60px)" /* Remaining space below Navbar */
        overflow="auto" /* Ensure scrolling if needed */
      >
        <Routes>
          <Route path="/" element={token ? <Feed /> : <Home />} />
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
