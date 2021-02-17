import React from 'react';
import {
  Box,
  Center,
  Text,
  Stack,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';

interface Image {
  imageId: number;
  filePath: string;
  fileName: string;
}
interface Props {
  image: Image;
  title: string;
  description: string;
}

export function Post(props: Props): JSX.Element {
  const { description, image, title } = props;
  return (
    <Center py={6}>
      <Box
        maxW={'40rem'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
      >
        <Box
          h={'210px'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}
        >
          <Image
            h={'210px'}
            src={`http://localhost:3000/images/post-images/${image.fileName}`}
            layout={'fill'}
          />
        </Box>
        <Stack>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          >
            {title}
          </Text>
          <Text color={'gray.500'}>{description}</Text>
        </Stack>
      </Box>
    </Center>
  );
}
