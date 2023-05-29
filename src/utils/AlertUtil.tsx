import {
  Alert,
  Text,
  Button,
  Box,
  Collapse,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
} from 'native-base';
import React from 'react';

export default function AlertUtil({
  title,
  message,
  close,
}: {
  title: string;
  message: string;
  close: () => void;
}) {
  return (
    <Box w="100%" alignItems="center" my={10}>
      <Collapse isOpen={true}>
        <Alert maxW="400" status="error">
          <VStack space={1} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between">
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: 'coolGray.800',
                  }}>
                  {title}
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0,
                }}
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: 'coolGray.600',
                }}
                onPress={close}
              />
            </HStack>
            <Box
              pl="6"
              _dark={{
                _text: {
                  color: 'coolGray.600',
                },
              }}>
              {message}
            </Box>
          </VStack>
        </Alert>
      </Collapse>
    </Box>
  );
}
