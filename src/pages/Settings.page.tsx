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
  updateAdminUsername,
  updateMaxUploadSize,
  updateTokenExpirationTime,
  changeUserPassword,
} from 'api';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '../hooks/useAppSettings';

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
    'edit-profile' | 'notification' | 'security' | 'roles' | 'admin'
  >('edit-profile');
  const [loadingSettings] = useState(true);
  const { appSettings, setAppSettings } = useAppSettings();

  // ✅ Load settings directly from localStorage (so UI doesn't show defaults)
  const storedSettings = JSON.parse(
    localStorage.getItem('userSettings') || '{}',
  );

  // ✅ Fallback to appSettings if localStorage isn't available
  const settings = { ...storedSettings, ...appSettings };
  const navigate = useNavigate();
  const [loading] = useState(false);

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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    console.log('🔄 FULL appSettings State:', appSettings);
  }, [appSettings]);

  useEffect(() => {
    if (appSettings.adminUsername) {
      console.log('✅ Admin Username Loaded:', appSettings.adminUsername);
    }
  }, [appSettings.adminUsername]);

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

  const handleRoleChange = async (
    userId: number,
    newRole: 'ADMIN' | 'USER',
  ) => {
    try {
      console.log(`🔄 Changing role of user ${userId} to ${newRole}...`);

      // ✅ Immediately update the backend
      await updateUserRole(userId, newRole);

      // ✅ Update the UI instantly
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );

      console.log(`✅ Role updated successfully!`);
    } catch (error) {
      console.error('❌ Error updating role:', error);
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
    setAppSettings((prev: typeof settings) => ({
      ...prev, // Keep existing settings
      notificationRefreshRate: rate, // Only update this field
    }));

    // ✅ Save to Windows Registry
    await updateNotificationRefreshRate(userData.id, rate);

    // ✅ Persist to localStorage
    localStorage.setItem('notificationRefreshRate', rate);

    // ✅ Dispatch global event to update notifications component instantly
    window.dispatchEvent(new Event('refresh-rate-change'));
  };

  const handleToggleLikeNotifications = async () => {
    try {
      const newState = !appSettings.likeNotifications;
      setAppSettings((prev: typeof settings) => ({
        ...prev,
        likeNotifications: newState, // ✅ Ensure the whole object is updated
      }));
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
      const newState = !appSettings.commentNotifications;
      setAppSettings((prev: typeof settings) => ({
        ...prev,
        commentNotifications: newState, // ✅ Ensure the whole object is updated
      }));
      localStorage.setItem('commentNotifications', String(newState)); // ✅ Instant UI update

      await updateCommentNotifications(userData.id, newState);
      console.log('✅ Comment Notifications updated in WinReg:', newState);
    } catch (error) {
      console.error('❌ Failed to update Comment Notifications:', error);
    }
  };
  const handleAdminUsernameChange = async (newUsername: string) => {
    try {
      await updateAdminUsername(newUsername);
      setAppSettings((prev: typeof appSettings) => ({
        ...prev,
        adminUsername: newUsername,
      })); // ✅ Update State
      console.log('✅ Admin Username updated:', newUsername);
    } catch (error) {
      console.error('❌ Failed to update Admin Username:', error);
    }
  };

  const handleMaxUploadSizeChange = async (size: string) => {
    try {
      await updateMaxUploadSize(size);
      setAppSettings((prev: typeof settings) => ({
        ...prev,
        maxUploadSize: size,
      })); // ✅ Update State
      console.log('✅ Max Upload Size updated:', size);
    } catch (error) {
      console.error('❌ Failed to update Max Upload Size:', error);
    }
  };

  const handleTokenExpirationChange = async (time: string) => {
    try {
      await updateTokenExpirationTime(time);
      setAppSettings((prev: typeof settings) => ({
        ...prev,
        tokenExpirationTime: time,
      })); // ✅ Update State
      console.log('✅ Token Expiration Time updated:', time);
    } catch (error) {
      console.error('❌ Failed to update Token Expiration Time:', error);
    }
  };
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert(t('New password and confirmation do not match.'));
      return;
    }

    try {
      await changeUserPassword(currentPassword, newPassword);
      alert(t('Password changed successfully!'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('❌ Error changing password:', error);
      alert(t('Failed to change password. Please try again.'));
    }
  };

  return (
    <Layout
      leftContent={
        <Box>
          <Heading size="md" mb={5}>
            {t('settings')}
          </Heading>
          <Stack spacing={3} align="flex-start">
            <Button onClick={() => setSelectedCategory('edit-profile')}>
              {t('editProfile')}
            </Button>
            <Button onClick={() => setSelectedCategory('notification')}>
              {t('notifications')}
            </Button>
            <Button onClick={() => setSelectedCategory('security')}>
              {t('security')}
            </Button>
            {userData.role === 'ADMIN' && (
              <>
                <Button onClick={() => setSelectedCategory('roles')}>
                  {t('roles')}
                </Button>
                <Button onClick={() => setSelectedCategory('admin')}>
                  {t('adminSettings')}
                </Button>
              </>
            )}
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
                  { key: 'username', label: t('username') },
                  { key: 'bio', label: t('about') },
                  { key: 'email', label: t('email') },
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
                  <Text fontWeight="bold">{t('gender')}:</Text>
                  <RadioGroup
                    value={userData.gender}
                    onChange={(value) => handleFieldUpdate('gender', value)}
                  >
                    <Stack direction="row">
                      <Radio value="female">{t('female')}</Radio>
                      <Radio value="male">{t('male')}</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
                <Box>
                  <Text fontWeight="bold">{t('language')}:</Text>
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
              <Stack spacing={5}>
                <Flex align="center" justify="space-between">
                  <Text>{t('likeNotifications')}</Text>
                  <input
                    type="checkbox"
                    checked={appSettings.likeNotifications}
                    disabled={loading}
                    onChange={handleToggleLikeNotifications}
                  />
                </Flex>

                <Flex align="center" justify="space-between">
                  <Text>{t('commentNotifications')}</Text>
                  <input
                    type="checkbox"
                    checked={appSettings.commentNotifications}
                    disabled={loading}
                    onChange={handleToggleCommentNotifications}
                  />
                </Flex>

                <Flex align="center" justify="space-between">
                  <Text>{t('refreshRate')}</Text>
                  <Select
                    w={'150px'}
                    value={appSettings.notificationRefreshRate}
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
          {selectedCategory === 'security' && (
            <Box>
              {/* Change Password Form */}
              <Box>
                <Text fontWeight="bold">{t('currentPass')}:</Text>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />

                <Text fontWeight="bold" mt={3}>
                  {t('newPass')}:
                </Text>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />

                <Text fontWeight="bold" mt={3}>
                  {t('confirmNewPass')}:
                </Text>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />

                <Button
                  mt={4}
                  colorScheme="blue"
                  isDisabled={
                    !currentPassword ||
                    !newPassword ||
                    newPassword !== confirmPassword
                  }
                  onClick={handleChangePassword}
                >
                  {t('changePass')}
                </Button>
              </Box>
            </Box>
          )}
          {selectedCategory === 'roles' && (
            <Box>
              <Heading size="md">{t('userRoles')}</Heading>
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
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(
                        user.id,
                        e.target.value as 'ADMIN' | 'USER',
                      )
                    }
                    width="120px"
                    minWidth="80px"
                    height="50px"
                    ml="auto"
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
                    onClick={() => handleDeleteUser(user.id)} // ✅ Pass user.id
                  />
                </Flex>
              ))}
            </Box>
          )}
          {selectedCategory === 'admin' && (
            <Box>
              <Heading size="md" mb={4}>
                {t('adminSettings')}
              </Heading>

              {/* ✅ Admin Username */}
              <Flex align="center" mb={4}>
                <Text fontWeight="bold" flex="1">
                  {t('adminUsername')}
                </Text>
                <Input
                  value={appSettings.adminUsername || ''}
                  onChange={(e) =>
                    setAppSettings((prev: typeof settings) => ({
                      ...prev,
                      adminUsername: e.target.value,
                    }))
                  }
                  variant="outline"
                  width="200px"
                  onBlur={() =>
                    handleAdminUsernameChange(appSettings.adminUsername)
                  }
                />
              </Flex>

              {/* ✅ Max Upload Size */}
              <Flex align="center" mb={4}>
                <Text fontWeight="bold" flex="1">
                  {t('uploadSize')}
                </Text>
                <Select
                  value={appSettings.maxUploadSize || '10MB'}
                  onChange={(e) => handleMaxUploadSizeChange(e.target.value)}
                  width="150px"
                >
                  <option value="10KB">10KB</option>
                  <option value="100KB">100KB</option>
                  <option value="1024KB">1MB</option>
                </Select>
              </Flex>

              {/* ✅ Token Expiration Time */}
              <Flex align="center">
                <Text fontWeight="bold" flex="1">
                  {t('tokenTime')}
                </Text>
                <Select
                  value={appSettings.tokenExpirationTime || '3600s'}
                  onChange={(e) => handleTokenExpirationChange(e.target.value)}
                  width="150px"
                >
                  <option value="360">360s</option>
                  <option value="3600">3600s</option>
                  <option value="7200">7200s</option>
                </Select>
              </Flex>
            </Box>
          )}
        </Box>
      }
    />
  );
};
