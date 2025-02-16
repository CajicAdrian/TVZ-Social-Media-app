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
  const bgLeftColor = useColorModeValue('blue.200', 'gray.900'); // Light mode = blue, Dark mode = dark gray
  const bgRightColor = useColorModeValue('white', 'blue.900'); // Light mode = blue, Dark mode = dark gray
  const textColor = useColorModeValue('black', 'white');
  return (
    <Box display="grid" gridTemplateColumns="20rem 1fr" position="relative">
      {/* Left Section */}
      <Box
        bg={bgLeftColor}
        color={textColor}
        position="fixed"
        top="0" /* Box stays fixed at the very top */
        left="0"
        w="20rem"
        h="100vh" /* Full viewport height */
        zIndex="0"
        p="10"
        pt="100px" /* Pushes content inside the box down by 60px */
      >
        {leftContent}
      </Box>

      {/* Right Section */}
      <Box
        ml="20rem" /* Pushes content to the right of the sidebar */
        bg={bgRightColor}
        color={textColor}
        position="fixed" /* Keeps the box fixed in place */
        top="0" /* Box stays fixed at the very top */
        h="100vh" /* Full viewport height */
        overflow="auto" /* Enables scrolling */
        p="10"
        pt="100px" /* Pushes content inside the box down by 60px */
        w="calc(100vw - 20rem)" /* Dynamically calculate width */
      >
        {rightContent}
      </Box>
    </Box>
  );
};
