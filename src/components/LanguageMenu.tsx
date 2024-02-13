import {
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import React, { ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';

const langNames: Record<string, string> = {
  hr: 'Hrvatski',
  en: 'English',
  de: 'Deutsch',
  nl: 'Nederlands',
  bg: 'български',
};

export const LanguageMenu = (): ReactElement => {
  const { i18n, t } = useTranslation();

  const lang = i18n.language;
  const onChange = useCallback(
    (lang: string | string[]) => {
      if (typeof lang !== 'string') {
        throw new Error('Got weird value for language');
      }

      i18n.changeLanguage(lang);
      localStorage.setItem('lang', lang);
    },
    [i18n],
  );

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
          defaultValue={lang}
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
