import React, { useContext } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';
import { Navbar } from 'components';
import { Grid } from '@chakra-ui/react';

import { Home, Login, Profile, Register, Feed } from 'pages';
import { AuthContext } from './components/AuthContext';
export const Routing = (): JSX.Element => {
  const { accessToken: token } = useContext(AuthContext);

  return (
    <Grid templateColumns="repeat(12, 1fr)" w="100%">
      <Navbar />
      <Grid
        templateColumns="repeat(12, 1fr)"
        px="1rem"
        w="100%"
        gridColumn="span 12"
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
            path="/profile/:uuid"
            element={token ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Grid>
    </Grid>
  );
};
