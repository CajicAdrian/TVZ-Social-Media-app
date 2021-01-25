import React from 'react';
import { Box, Container, Icon, useColorMode } from '@chakra-ui/react';
import { MdWbSunny } from 'react-icons/md';

export const Navbar = (): JSX.Element => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Box
      gridColumn="span 12"
      bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
      px="5"
      py="2"
      d="flex"
      alignItems="center"
    >
      <Container>
        <Box>
          <Icon as={MdWbSunny} cursor="pointer" onClick={toggleColorMode} />
        </Box>
      </Container>
    </Box>
  );
};
