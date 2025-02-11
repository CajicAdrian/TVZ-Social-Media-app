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
  IconButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import VectorIcon from '../images/Vector.png';
import { LanguageMenu } from '../components/LanguageMenu';
import { Layout } from '../components/Layout';
import {
  getCurrentUser,
  updateUserSettings,
  uploadProfileImage,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateCommentNotifications,
  updateLikeNotifications,
  updateNotificationRefreshRate,
} from 'api';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

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
    'edit-profile' | 'notification' | 'help' | 'roles'
  >('edit-profile');
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem('userSettings') || '{}');
  });
  const navigate = useNavigate();

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
  const [updatedRoles, setUpdatedRoles] = useState<{
    [key: number]: 'ADMIN' | 'USER';
  }>({});
  const [likeNotifications, setLikeNotifications] = useState<boolean>(
    localStorage.getItem('likeNotifications') === 'true',
  );
  const [commentNotifications, setCommentNotifications] = useState<boolean>(
    localStorage.getItem('commentNotifications') === 'true',
  );
  const [notificationRefreshRate, setNotificationRefreshRate] =
    useState<string>('30s');
  const [loading] = useState(true);

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

  useEffect(() => {
    if (loadingSettings) {
      console.log('⏳ Settings still loading, preventing navigation');
      return;
    }

    if (!userData?.id && localStorage.getItem('user')) {
      console.log(
        '⚠️ User data missing, but found user in localStorage. Waiting...',
      );
      return;
    }

    if (!userData?.id) {
      console.warn('⚠️ User data missing, redirecting to login');
      navigate('/login');
    }
  }, [loadingSettings, userData?.id]);

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
          }
        } catch (error) {
          console.error('❌ Failed to refresh user data:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('❌ Image upload failed:', error);
    }
  };

  const handleRoleChange = (userId: number, newRole: 'ADMIN' | 'USER') => {
    setUpdatedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const saveRoleChanges = async () => {
    try {
      await Promise.all(
        Object.entries(updatedRoles).map(([userId, newRole]) =>
          updateUserRole(Number(userId), newRole as 'ADMIN' | 'USER'),
        ),
      );
      setUpdatedRoles({});
    } catch (error) {
      console.error('Error updating roles:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm(t('Are you sure you want to delete this user?'))) {
      try {
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  const handleRefreshRateChange = async (rate: string) => {
    console.log(`🔄 Updating refresh rate to: ${rate}`);

    // ✅ Set state immediately
    setNotificationRefreshRate(rate);

    // ✅ Save to Windows Registry
    await updateNotificationRefreshRate(userData.id, rate);

    // ✅ Persist to localStorage
    localStorage.setItem('notificationRefreshRate', rate);

    // ✅ Dispatch global event to update notifications component instantly
    window.dispatchEvent(new Event('refresh-rate-change'));
  };

  const handleToggleLikeNotifications = async () => {
    try {
      const newState = !likeNotifications;
      setLikeNotifications(newState);
      localStorage.setItem('likeNotifications', String(newState)); // ✅ Instant UI update

      await updateLikeNotifications(userData.id, newState);
      console.log('✅ Like Notifications updated in WinReg:', newState);
    } catch (error) {
      console.error('❌ Failed to update Like Notifications:', error);
    }
  };

  // ✅ Toggle Comment Notifications (updates WinReg & cache)
  const handleToggleCommentNotifications = async () => {
    try {
      const newState = !commentNotifications;
      setCommentNotifications(newState);
      localStorage.setItem('commentNotifications', String(newState)); // ✅ Instant UI update

      await updateCommentNotifications(userData.id, newState);
      console.log('✅ Comment Notifications updated in WinReg:', newState);
    } catch (error) {
      console.error('❌ Failed to update Comment Notifications:', error);
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
                  {userData.id ? (
                    <LanguageMenu userId={userData.id} />
                  ) : (
                    <Text>Loading...</Text>
                  )}
                </Box>
              </Stack>
            </Box>
          )}
          {selectedCategory === 'notification' && (
            <Box>
              <Heading size="md" mb={4}>
                {t('Notification Settings')}
              </Heading>

              <Stack spacing={5}>
                <Flex align="center" justify="space-between">
                  <Text>{t('Receive Like Notifications')}</Text>
                  <input
                    type="checkbox"
                    checked={likeNotifications}
                    disabled={loading}
                    onChange={handleToggleLikeNotifications}
                  />
                </Flex>

                <Flex align="center" justify="space-between">
                  <Text>{t('Receive Comment Notifications')}</Text>
                  <input
                    type="checkbox"
                    checked={commentNotifications}
                    disabled={loading}
                    onChange={handleToggleCommentNotifications}
                  />
                </Flex>

                <Flex align="center" justify="space-between">
                  <Text>{t('Notification Refresh Rate')}</Text>
                  <Select
                    w={'150px'}
                    value={notificationRefreshRate}
                    onChange={(e) => handleRefreshRateChange(e.target.value)}
                  >
                    <option value="10s">10s</option>
                    <option value="30s">30s</option>
                    <option value="1min">1 min</option>
                  </Select>
                </Flex>
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
                  p={4} // Padding for more spacing
                  borderBottom="1px solid gray"
                  gap={4} // Adds space between items inside each row
                >
                  {/* Avatar + Username */}
                  <Flex align="center" gap={4}>
                    <Avatar
                      size="md"
                      name={user.username}
                      bg="lightblue"
                      src={
                        user.profileImage &&
                        !user.profileImage.includes('placeholder')
                          ? `http://localhost:3000/${user.profileImage.replace(
                              'static/',
                              '',
                            )}`
                          : undefined
                      }
                    />
                    <Text fontSize="md">{user.username}</Text>
                  </Flex>

                  {/* Role Selection Dropdown - Pushed to the Right */}
                  <Select
                    value={updatedRoles[user.id] || user.role}
                    onChange={(e) =>
                      handleRoleChange(
                        user.id,
                        e.target.value as 'ADMIN' | 'USER',
                      )
                    }
                    width="120px"
                    minWidth="80px"
                    height="50px"
                    ml="auto" // Pushes the dropdown to the right
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </Select>

                  {/* Delete User Button */}
                  <IconButton
                    aria-label="Delete User"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="md"
                    ml={2} // Adds spacing so it doesn’t stick to the dropdown
                  />
                </Flex>
              ))}

              {/* Save Changes Button */}
              <Button mt={6} colorScheme="blue" onClick={saveRoleChanges}>
                {t('Save Changes')}
              </Button>
            </Box>
          )}
        </Box>
      }
    />
  );
};
