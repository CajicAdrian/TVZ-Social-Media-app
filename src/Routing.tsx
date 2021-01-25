import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Navbar } from 'components';
import { Grid } from '@chakra-ui/react';

import { StartPage } from 'pages';
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
          <Route exact path="/" component={StartPage} />
        </Grid>
      </Grid>
    </Switch>
  );
};
