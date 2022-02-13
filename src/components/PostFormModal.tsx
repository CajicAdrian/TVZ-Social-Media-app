import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FormData {
  title: string;
  description: string;
  image: FileList;
}

interface Props {
  mode: 'edit' | 'create';
  isOpen: boolean;
  onSubmit: (data: FormData) => void;
  onDelete: () => void;
  onClose: () => void;
  value: Partial<FormData>;
}

interface Quote {
  quote: string;
  author: string;
}

interface QuoteOfDay {
  contents: {
    quotes: Quote[];
  },
}

export const PostFormModal = ({
  isOpen,
  onSubmit,
  onClose,
  value,
  mode,
  onDelete,
}: Props): ReactElement => {
  const { t } = useTranslation('feed');
  const { handleSubmit, setValue, register } = useForm<FormData>({
    defaultValues: value,
  });
  const [fetchingQod, setFetchingQod] = useState<boolean>(false);

  const fetchQuoteOfDay = () => {
    setFetchingQod(true);
    axios.get<QuoteOfDay>('https://quotes.rest/qod').then((qod) => {
      const quote = qod.data.contents.quotes[0];
      setValue('title', `Quote by ${quote.author}`);
      setValue('description', `Quote by ${quote.quote}`);
      setFetchingQod(false);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
              <Stack spacing={4}>
                {mode === 'edit' && (
                  <Button colorScheme="red" size="sm" onClick={onDelete}>
                    {t('delete')}
                  </Button>
                )}
                {mode === 'create' && (
                  <Button size="sm" onClick={fetchQuoteOfDay} isLoading={fetchingQod}>
                    {t('quote_of_day')}
                  </Button>
                )}
                <FormControl id="title">
                  <FormLabel>{t('title')}:</FormLabel>
                  <Input
                    type="text"
                    {...register('title', { required: true })}
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>{t('description')}:</FormLabel>
                  <Input
                    type="text"
                    {...register('description', { required: true })}
                  />
                </FormControl>
                {mode === 'create' && (
                  <FormControl id="image">
                    <FormLabel>{t('image')}:</FormLabel>
                    <Input
                      type="file"
                      {...register('image', { required: true })}
                    />
                  </FormControl>
                )}
                <Stack spacing={10}>
                  <Button
                    type="submit"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    {t('send')}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
