import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from 'components';
import { Box } from '@chakra-ui/react';
import { Home, Login, Profile, Register, Feed, Settings } from 'pages';
import { AuthContext } from './components/AuthContext';

export const Routing = (): JSX.Element => {
  const { accessToken: token, user, isInitialized } = useContext(AuthContext);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <Box w="100vw" h="100vh" position="relative">
      <Navbar />
      <Box as="main" mt="60px" w="100%" h="calc(100vh - 60px)" overflow="auto">
        <Routes>
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
