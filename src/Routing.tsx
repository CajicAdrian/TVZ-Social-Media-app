import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Navbar } from 'components';
import { Grid } from '@chakra-ui/react';
import { useAsync } from 'react-use';
import { getPosts } from 'api';

import { Home, Login, Profile, Register, Chat, Feed } from 'pages';
export const Routing = (): JSX.Element => {
  const token = localStorage.getItem('accessToken');
  const { loading, value } = useAsync(getPosts);
  if (!value && !loading) {
    localStorage.setItem('accessToken', '');
  }

  return (
    <Switch>
      <Grid templateColumns="repeat(12, 1fr)" w="100%">
        <Navbar />
        <Grid
          templateColumns="repeat(12, 1fr)"
          px="1rem"
          w="100%"
          gridColumn="span 12"
        >
          <Route
            exact
            path="/"
            render={() => {
              return token ? <Feed /> : <Home />;
            }}
          />
          <Route
            exact
            path="/login"
            render={() => {
              return token ? <Redirect to="/" /> : <Login />;
            }}
          />
          <Route
            exact
            path="/register"
            render={() => {
              return token ? <Redirect to="/" /> : <Register />;
            }}
          />
          <Route
            exact
            path="/profile/:uuid"
            render={() => {
              return token ? <Profile /> : <Redirect to="/login" />;
            }}
          />
        </Grid>
      </Grid>
    </Switch>
  );
};
