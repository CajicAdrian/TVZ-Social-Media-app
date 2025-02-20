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
  Textarea,
  VStack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import React, { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaPaperPlane, FaTrash, FaQuoteLeft } from 'react-icons/fa';
import { getQuoteOfTheDay } from 'api';

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

export const PostFormModal = ({
  isOpen,
  onSubmit,
  onClose,
  value,
  mode,
  onDelete,
}: Props): ReactElement => {
  const { t } = useTranslation('feed');
  const { handleSubmit, setValue, register, getValues } = useForm<FormData>({
    defaultValues: value,
  });

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const [quote, setQuote] = useState<string | null>(null);

  // ✅ Fetch the quote when modal opens
  useEffect(() => {
    if (isOpen) {
      getQuoteOfTheDay().then(setQuote);
    }
  }, [isOpen]);

  // ✅ Function to insert the quote into the description
  const handleInsertQuote = async () => {
    let selectedQuote = quote;

    // If no quote exists yet, fetch one
    if (!selectedQuote) {
      selectedQuote = await getQuoteOfTheDay();
      setQuote(selectedQuote);
    }

    // Append the quote to the description field
    const currentDescription = getValues('description') || '';
    setValue('description', `${currentDescription}\n${selectedQuote}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={bgColor} color={textColor} borderRadius="lg" p={4}>
        <ModalCloseButton />

        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              {mode === 'edit' && (
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={onDelete}
                  leftIcon={<FaTrash />}
                >
                  {t('delete')}
                </Button>
              )}

              <FormControl>
                <FormLabel>{t('title')}:</FormLabel>
                <Input
                  type="text"
                  {...register('title', { required: true })}
                  bg="whiteAlpha.800"
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('description')}:</FormLabel>
                <Textarea
                  {...register('description', { required: true })}
                  bg="whiteAlpha.800"
                  resize="none"
                  minH="120px"
                />
              </FormControl>

              {/* ✅ Insert Quote Button */}
              <Button
                colorScheme="gray"
                variant="outline"
                size="sm"
                onClick={handleInsertQuote} // ✅ Handles inserting or fetching a quote
                alignSelf="flex-start"
              >
                {t('quoteOfTheDay')}
              </Button>

              {mode === 'create' && (
                <FormControl>
                  <FormLabel>{t('image')}:</FormLabel>
                  <Input
                    type="file"
                    {...register('image', { required: true })}
                    p={1}
                    bg="whiteAlpha.800"
                  />
                </FormControl>
              )}

              <HStack justify="flex-end">
                <Button
                  type="submit"
                  colorScheme="blue"
                  leftIcon={<FaPaperPlane />}
                >
                  {t('send')}
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
