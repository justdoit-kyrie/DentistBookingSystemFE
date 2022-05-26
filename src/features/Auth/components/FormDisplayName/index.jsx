import { Box, Button, Flex } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { InputField } from '~/components';
import { splitDisplayName } from '~/utils';
import { init, loginFailed, loginSuccess } from '../../authSlice';

// initial validation rules
const schema = yup
  .object({
    displayName: yup.string().required('displayName is required')
  })
  .required();

// initial values
const defaultValues = {
  displayName: ''
};

const FormDisplayName = ({ t, withoutDisplayName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = async ({ displayName }) => {
    dispatch(init());
    try {
      const { firstName, lastName } = splitDisplayName(displayName);
      dispatch(loginSuccess({ ...withoutDisplayName, firstName, lastName }));
      return navigate('/');
    } catch (error) {
      dispatch(loginFailed());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="2rem">
        <Box mt="2rem">
          <InputField
            errors={errors}
            control={control}
            name="displayName"
            placeholder={t('auth.login.displayNamePlaceholder')}
          />
        </Box>

        <Button
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          size="full"
          variant="primary"
          textTransform="capitalize"
          borderRadius="1rem"
        >
          {t('auth.login.submit')}
        </Button>
      </Flex>
    </form>
  );
};

export default withTranslation()(FormDisplayName);
