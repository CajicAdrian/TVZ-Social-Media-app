import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

interface LayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export const Layout = ({
  leftContent,
  rightContent,
}: LayoutProps): JSX.Element => {
  const bgLeftColor = useColorModeValue('blue.200', 'gray.900');
  const bgRightColor = useColorModeValue('white', 'blue.900');
  const textColor = useColorModeValue('black', 'white');
  return (
    <Box display="grid" gridTemplateColumns="20rem 1fr" position="relative">
      <Box
        bg={bgLeftColor}
        color={textColor}
        position="fixed"
        top="0"
        left="0"
        w="20rem"
        h="100vh"
        zIndex="0"
        p="10"
        pt="100px"
      >
        {leftContent}
      </Box>

      <Box
        ml="20rem"
        bg={bgRightColor}
        color={textColor}
        position="fixed"
        top="0"
        h="100vh"
        overflow="auto"
        p="10"
        pt="100px"
        w="calc(100vw - 20rem)"
      >
        {rightContent}
      </Box>
    </Box>
  );
};
