import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Navbar } from 'components';
import { Grid } from '@chakra-ui/react';

import { Home, Login, Profile, Register, Chat, Feed } from 'pages';
export const Routing = (): JSX.Element => {
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
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile/:uuid" component={Profile} />
          <Route exact path="/chat" component={Chat} />
          <Route exact path="/feed" component={Feed} />
        </Grid>
      </Grid>
    </Switch>
  );
};
