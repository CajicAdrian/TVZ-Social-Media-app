import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Button,
  Heading,
  Input,
  Image,
  Flex,
  Text,
  RadioGroup,
  Radio,
  Textarea,
  Select,
  Avatar,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import VectorIcon from '../images/Vector.png';
import { LanguageMenu } from '../components/LanguageMenu';
import { Layout } from '../components/Layout';
import {
  getCurrentUser,
  getUserSettings,
  updateUserSettings,
  uploadProfileImage,
  getAllUsers,
  updateUserRole,
} from 'api';

interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
  profileImage?: string;
  email: string;
  bio?: string;
  gender: 'male' | 'female';
}

export const Settings = (): JSX.Element => {
  const { t } = useTranslation('settings');
  const [selectedCategory, setSelectedCategory] = useState<
    'edit-profile' | 'notification' | 'privacy' | 'security' | 'help' | 'roles'
  >('edit-profile');

  const [userData, setUserData] = useState<User>({
    id: 0,
    username: '',
    role: 'USER',
    profileImage: '',
    email: '',
    bio: '',
    gender: 'male',
  });

  const [users, setUsers] = useState<User[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        console.log('✅ Fetched User Data:', data); // Debugging
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch user data:', error);
      }
    };

    const loadUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUserData();
    loadUsers();
  }, []);

  const handleFieldUpdate = async (field: keyof User, value: string) => {
    try {
      if (!value.trim()) return; // Prevent empty updates

      console.log(`🚀 Updating ${field} with value:`, value);
      await updateUserSettings({ ...userData, [field]: value });

      setUserData((prev) => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error(`❌ Failed to update ${field}:`, error);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    console.log('🚀 Uploading image for user ID:', userData.id);

    if (!userData.id) {
      console.error('❌ Error: User ID is missing!');
      return;
    }

    try {
      const uploadedImage = await uploadProfileImage(userData.id, file);
      console.log('✅ Image Upload Response:', uploadedImage);

      if (!uploadedImage || !uploadedImage.filePath) {
        console.error(
          '❌ Image upload response is missing filePath:',
          uploadedImage,
        );
        return;
      }

      const newProfileImage = uploadedImage.filePath.replace('static/', '');
      console.log('🔄 Updating Profile Image:', newProfileImage);

      // ✅ Update the UI instantly
      setUserData((prev) => ({
        ...prev,
        profileImage: newProfileImage,
      }));

      // ✅ Notify Navbar and other components to refresh the profile image
      window.dispatchEvent(new Event('profileUpdated'));

      // ✅ Fetch latest user data after 1s delay to confirm backend save
      setTimeout(async () => {
        try {
          const refreshedUserData = await getCurrentUser();
          console.log('🔄 Refetched User Data:', refreshedUserData);

          if (refreshedUserData.profileImage) {
            setUserData((prev) => ({
              ...prev,
              profileImage: refreshedUserData.profileImage.replace(
                'static/',
                '',
              ),
            }));

            // ✅ Dispatch event again in case of delayed updates
            window.dispatchEvent(new Event('profileUpdated'));
          }
        } catch (error) {
          console.error('❌ Failed to refresh user data:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('❌ Image upload failed:', error);
    }
  };

  return (
    <Layout
      leftContent={
        <Box>
          <Heading size="md" mb={5}>
            {t('Settings')}
          </Heading>
          <Stack spacing={3} align="flex-start">
            <Button onClick={() => setSelectedCategory('edit-profile')}>
              {t('Edit Profile')}
            </Button>
            <Button onClick={() => setSelectedCategory('notification')}>
              {t('Notification')}
            </Button>
            <Button onClick={() => setSelectedCategory('privacy')}>
              {t('Privacy')}
            </Button>
            <Button onClick={() => setSelectedCategory('security')}>
              {t('Security')}
            </Button>
            <Button onClick={() => setSelectedCategory('help')}>
              {t('Help')}
            </Button>
            <Button onClick={() => setSelectedCategory('roles')}>
              {t('Roles')}
            </Button>
          </Stack>
        </Box>
      }
      rightContent={
        <Box>
          {selectedCategory === 'edit-profile' && (
            <Box>
              <Flex direction="column" align="center" mb={6}>
                <Box
                  borderRadius="full"
                  boxSize="150px"
                  border="2px solid gray"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                  cursor={userData.id ? 'pointer' : 'not-allowed'} // ❌ Prevents upload if no userId
                  opacity={userData.id ? 1 : 0.5} // ❌ Grays out if userData isn't ready
                  onClick={() =>
                    userData.id &&
                    document.getElementById('fileUpload')?.click()
                  }
                >
                  <Avatar
                    size="2xl"
                    boxSize="full"
                    name={userData.username}
                    bg="lightblue"
                    src={
                      userData.profileImage &&
                      !userData.profileImage.includes('placeholder')
                        ? `http://localhost:3000/${userData.profileImage.replace(
                            'static/',
                            '',
                          )}`
                        : undefined
                    }
                  />
                </Box>
                <Input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                  disabled={!userData.id} // ❌ Prevents clicking if userId is missing
                />
              </Flex>
              <Stack spacing={6}>
                {[
                  { key: 'username', label: t('Username') },
                  { key: 'bio', label: t('About Me') },
                  { key: 'email', label: t('Email Address') },
                ].map(({ key, label }) => (
                  <Flex align="center" key={key}>
                    <Box flex="1">
                      <Text fontWeight="bold">{label}:</Text>
                      <Input
                        name={key}
                        value={String(userData[key as keyof User] ?? '')} // ✅ Ensures value is always a string
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            [key as keyof User]: e.target.value,
                          })
                        }
                        onBlur={() =>
                          handleFieldUpdate(
                            key as keyof User,
                            String(userData[key as keyof User] ?? ''),
                          )
                        }
                        variant="unstyled"
                        borderBottom="2px solid black"
                        width="100%"
                      />
                    </Box>
                    <Image
                      src={VectorIcon}
                      alt="Edit"
                      boxSize="20px"
                      ml={3}
                      cursor="pointer"
                      onClick={() =>
                        handleFieldUpdate(
                          key as keyof User,
                          String(userData[key as keyof User] ?? ''),
                        )
                      } // ✅ Ensures safe type conversion
                    />
                  </Flex>
                ))}

                <Box>
                  <Text fontWeight="bold">{t('Gender')}:</Text>
                  <RadioGroup
                    value={userData.gender}
                    onChange={(value) => handleFieldUpdate('gender', value)}
                  >
                    <Stack direction="row">
                      <Radio value="female">{t('Female')}</Radio>
                      <Radio value="male">{t('Male')}</Radio>
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

          {selectedCategory === 'help' && (
            <Box>
              <Heading size="md">
                {t('Get help from our dedicated team:')}
              </Heading>
              <Flex mt={4} align="center">
                <Textarea placeholder="Describe your issue here..." flex="1" />
                <Button ml={2}>{t('Send Request')}</Button>
              </Flex>
            </Box>
          )}

          {selectedCategory === 'roles' && (
            <Box>
              <Heading size="md">{t('User Roles')}</Heading>
              {users.map((user) => (
                <Flex
                  key={user.id}
                  align="center"
                  justify="space-between"
                  p={3}
                  borderBottom="1px solid gray"
                >
                  <Flex align="center">
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src={
                        user.profileImage || 'https://via.placeholder.com/40'
                      }
                    />
                    <Text ml={3}>{user.username}</Text>
                  </Flex>
                  <Select
                    value={user.role}
                    onChange={(e) =>
                      updateUserRole(
                        user.id,
                        e.target.value as 'ADMIN' | 'USER',
                      )
                    }
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </Select>
                </Flex>
              ))}
            </Box>
          )}
        </Box>
      }
    />
  );
};
