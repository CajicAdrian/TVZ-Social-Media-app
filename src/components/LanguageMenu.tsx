import {
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';
import { getUserLanguage, updateUserLanguage } from 'api';

const langNames: Record<string, string> = {
  hr: 'Hrvatski',
  en: 'English',
  de: 'Deutsch',
  nl: 'Nederlands',
  bg: 'български',
};

export const LanguageMenu = ({ userId }: { userId: number }): ReactElement => {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (userId) {
      // ✅ Only apply if user is logged in
      getUserLanguage(userId).then((savedLang) => {
        setLang(savedLang);
        i18n.changeLanguage(savedLang);
      });
    }
  }, [userId, i18n]);

  const onChange = useCallback(
    async (selectedLang: string | string[]) => {
      if (typeof selectedLang !== 'string') {
        throw new Error('Got weird value for language');
      }

      setLang(selectedLang);
      i18n.changeLanguage(selectedLang);
      await updateUserLanguage(userId, selectedLang);
    },
    [i18n, userId],
  );

  if (lang === null) return <p>Loading...</p>; // ✅ Prevents flashing English

  return (
    <Menu closeOnSelect={true}>
      <MenuButton>
        <Flex>
          <MdLanguage />
          &nbsp;
          {langNames[lang] ?? '???'}
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          value={lang}
          title={t('language')}
          type="radio"
          onChange={onChange}
        >
          <MenuItemOption value="hr">{langNames.hr}</MenuItemOption>
          <MenuItemOption value="en">{langNames.en}</MenuItemOption>
          <MenuItemOption value="de">{langNames.de}</MenuItemOption>
          <MenuItemOption value="nl">{langNames.nl}</MenuItemOption>
          <MenuItemOption value="bg">{langNames.bg}</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};
