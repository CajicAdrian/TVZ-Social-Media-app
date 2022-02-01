import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Navbar } from 'components';
import { Grid } from '@chakra-ui/react';

import { Home, Login, Profile, Register, Feed } from 'pages';
import { AuthContext } from './components/AuthContext';
export const Routing = (): JSX.Element => {
  const { accessToken: token } = useContext(AuthContext);

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
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Grid>
      </Grid>
    </Switch>
  );
};
