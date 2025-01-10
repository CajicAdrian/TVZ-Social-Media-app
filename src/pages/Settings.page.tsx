import React, { useState } from 'react';
import {
  Box,
  Stack,
  Button,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Image,
  Flex,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import VectorIcon from '../images/Vector.png'; // Import the heart image
import { LanguageMenu } from '../components/LanguageMenu'; // Update the path based on your project structure
import { Layout } from '../components/Layout'; // Import the reusable Layout component

export const Settings = (): JSX.Element => {
  const { t } = useTranslation('settings');

  const [selectedCategory, setSelectedCategory] = useState<
    'edit-profile' | 'notification' | 'privacy' | 'security' | 'help'
  >('edit-profile');

  // Handle category change
  const handleCategoryChange = (
    category: 'edit-profile' | 'notification' | 'privacy' | 'security' | 'help',
  ) => {
    setSelectedCategory(category);
  };

  return (
    <Layout
      leftContent={
        <Box>
          <Heading size="md" mb={5}>
            {t('Settings')}
          </Heading>
          <Stack spacing={3} align="flex-start">
            <Button
              justifyContent="flex-start"
              w="100%"
              variant={selectedCategory === 'edit-profile' ? 'solid' : 'ghost'}
              onClick={() => handleCategoryChange('edit-profile')}
            >
              {t('Edit Profile')}
            </Button>
            <Button
              justifyContent="flex-start"
              w="100%"
              variant={selectedCategory === 'notification' ? 'solid' : 'ghost'}
              onClick={() => handleCategoryChange('notification')}
            >
              {t('Notification')}
            </Button>
            <Button
              justifyContent="flex-start"
              w="100%"
              variant={selectedCategory === 'privacy' ? 'solid' : 'ghost'}
              onClick={() => handleCategoryChange('privacy')}
            >
              {t('Privacy')}
            </Button>
            <Button
              justifyContent="flex-start"
              w="100%"
              variant={selectedCategory === 'security' ? 'solid' : 'ghost'}
              onClick={() => handleCategoryChange('security')}
            >
              {t('Security')}
            </Button>
            <Button
              justifyContent="flex-start"
              w="100%"
              variant={selectedCategory === 'help' ? 'solid' : 'ghost'}
              onClick={() => handleCategoryChange('help')}
            >
              {t('Help')}
            </Button>
          </Stack>
        </Box>
      }
      rightContent={
        <Box>
          {/* Edit Profile Section */}
          {selectedCategory === 'edit-profile' && (
            <Box>
              <Flex direction="column" align="center" mb={6}>
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src="https://via.placeholder.com/150"
                  alt="Profile Picture"
                />
                <Button mt={2} variant="link">
                  {t('Change Profile Photo')}
                </Button>
              </Flex>
              <Stack spacing={6}>
                <Flex align="center">
                  <Box flex="1">
                    <Text fontWeight="bold">{t('Username')}:</Text>
                    <Input
                      defaultValue="Adrian Čajić"
                      border="none"
                      borderBottom="2px solid black"
                      borderRadius="0"
                      _focus={{
                        outline: 'none',
                        borderBottom: '2px solid blue',
                      }}
                    />
                  </Box>
                  <Image
                    src={VectorIcon}
                    alt="Edit"
                    boxSize="20px"
                    ml={3}
                    cursor="pointer"
                  />
                </Flex>
                <Flex align="center">
                  <Box flex="1">
                    <Text fontWeight="bold">{t('About Me')}:</Text>
                    <Input
                      defaultValue="If my girlfriend isn’t in it, is the picture really that good?"
                      border="none"
                      borderBottom="2px solid black"
                      borderRadius="0"
                      _focus={{
                        outline: 'none',
                        borderBottom: '2px solid blue',
                      }}
                    />
                  </Box>
                  <Image
                    src={VectorIcon}
                    alt="Edit"
                    boxSize="20px"
                    ml={3}
                    cursor="pointer"
                  />
                </Flex>
                <Flex align="center">
                  <Box flex="1">
                    <Text fontWeight="bold">{t('Email Address')}:</Text>
                    <Input
                      defaultValue="adrian@gmail.com"
                      border="none"
                      borderBottom="2px solid black"
                      borderRadius="0"
                      _focus={{
                        outline: 'none',
                        borderBottom: '2px solid blue',
                      }}
                    />
                  </Box>
                  <Image
                    src={VectorIcon}
                    alt="Edit"
                    boxSize="20px"
                    ml={3}
                    cursor="pointer"
                  />
                </Flex>
                <Box>
                  <Text fontWeight="bold">{t('Gender')}:</Text>
                  <RadioGroup defaultValue="male">
                    <Stack direction="row">
                      <Radio
                        value="female"
                        _checked={{
                          bg: 'blue.500',
                          color: 'white',
                          borderColor: 'blue.500',
                        }}
                      >
                        {t('F')}
                      </Radio>
                      <Radio
                        value="male"
                        _checked={{
                          bg: 'blue.500',
                          color: 'white',
                          borderColor: 'blue.500',
                        }}
                      >
                        {t('M')}
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
                <Box>
                  <Text fontWeight="bold">{t('Language')}:</Text>
                  <LanguageMenu />
                </Box>
              </Stack>
            </Box>
          )}

          {/* Notification Settings */}
          {selectedCategory === 'notification' && (
            <Box>
              <Heading size="md">{t('Notification Settings')}</Heading>
              <Text mt={4}>{t('Manage your notification preferences.')}</Text>
            </Box>
          )}

          {/* Privacy Settings */}
          {selectedCategory === 'privacy' && (
            <Box>
              <Heading size="md">{t('Privacy Settings')}</Heading>
              <Text mt={4}>{t('Manage your privacy preferences.')}</Text>
            </Box>
          )}

          {/* Security Settings */}
          {selectedCategory === 'security' && (
            <Box>
              <Heading size="md">{t('Security Settings')}</Heading>
              <Text mt={4}>{t('Manage your security preferences.')}</Text>
            </Box>
          )}

          {/* Help */}
          {selectedCategory === 'help' && (
            <Box>
              <Heading size="md">{t('Help & Support')}</Heading>
              <Text mt={4}>
                {t('Get help and find answers to your questions.')}
              </Text>
            </Box>
          )}
        </Box>
      }
    />
  );
};
