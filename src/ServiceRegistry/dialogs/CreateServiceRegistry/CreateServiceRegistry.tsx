import { useState, useEffect, FunctionComponent } from 'react';
import {
  Alert,
  Form,
  FormAlert,
  FormGroup,
  TextInput,
  Flex,
  FlexItem,
  Divider,
  FormProps,
} from '@patternfly/react-core';
import { Configuration, RegistriesApi } from '@rhoas/registry-management-sdk';
import { NewServiceregistry, FormDataValidationState } from '@app/models';
import {
  MASCreateModal,
  CreateServiceRegistryProps,
  BaseModalProps,
} from '@app/components';
import { useTranslation } from 'react-i18next';
import {
  isServiceApiError,
  MAX_SERVICE_REGISTRY_NAME_LENGTH,
  ErrorCodes,
} from '@app/utils';
import {
  useAlert,
  AlertVariant,
  useAuth,
  useConfig,
  Quota,
  QuotaType,
  useQuota,
  QuotaValue,
} from '@rhoas/app-services-ui-shared';
import { QuotaAlert } from './QuotaAlert';
import { ServiceRegistryInformation } from './ServiceRegistryInformation';
import './CreateServiceRegistry.css';

const CreateServiceRegistry: FunctionComponent<
  BaseModalProps & CreateServiceRegistryProps
> = ({ fetchServiceRegistries, hasUserTrialInstance, hideModal }) => {
  const newServiceRegistry: NewServiceregistry = new NewServiceregistry();
  const { t } = useTranslation(['service-registry', 'common']);
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const { addAlert } = useAlert() || {};
  const { getQuota } = useQuota() || {};

  const [nameValidated, setNameValidated] = useState<FormDataValidationState>({
    fieldState: 'default',
  });
  const [registryFormData, setRegistryFormData] =
    useState<NewServiceregistry>(newServiceRegistry);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [isCreationInProgress, setCreationInProgress] = useState(false);
  const [quota, setQuota] = useState<Quota>();
  const [
    hasServiceRegistryCreationFailed,
    setHasServiceRegistryCreationFailed,
  ] = useState<boolean>(false);

  const srsQuota: QuotaValue | undefined = quota?.data?.get(QuotaType?.srs);
  const loadingQuota = quota?.loading === undefined ? true : quota?.loading;
  const isSrsTrial = !srsQuota;
  const shouldDisabledButton =
    loadingQuota ||
    hasUserTrialInstance ||
    hasServiceRegistryCreationFailed ||
    (srsQuota && srsQuota?.remaining === 0);

  const resetForm = () => {
    setNameValidated({ fieldState: 'default' });
    setRegistryFormData(newServiceRegistry);
    setIsFormValid(true);
  };
  const manageQuota = async () => {
    if (getQuota) {
      await getQuota().then((res) => {
        setQuota(res);
      });
    }
  };

  useEffect(() => {
    manageQuota();
  }, []);

  useEffect(() => {
    if (nameValidated.fieldState !== 'error') {
      setIsFormValid(true);
    }
  }, [nameValidated]);

  const handleTextInputName = (name: string) => {
    setRegistryFormData({ ...registryFormData, name });
    let isValid = true;
    if (name && !/^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(name.trim())) {
      isValid = false;
    }

    if (name && name.length > MAX_SERVICE_REGISTRY_NAME_LENGTH) {
      setNameValidated({
        fieldState: 'error',
        message: t('service_registry_name_length_is_greater_than_expected', {
          maxLength: MAX_SERVICE_REGISTRY_NAME_LENGTH,
        }),
      });
    } else if (isValid && nameValidated.fieldState === 'error') {
      setNameValidated({ fieldState: 'default', message: '' });
    } else if (!isValid) {
      setNameValidated({
        fieldState: 'error',
        message: t('input_filed_invalid_helper_text'),
      });
    }
  };

  const handleServerError = (error: unknown) => {
    let reason: string | undefined;
    let code: string | undefined;
    if (isServiceApiError(error)) {
      reason = error.response?.data.reason;
      code = error.response?.data.code;
    }
    if (
      code === ErrorCodes.FAILED_TO_CHECK_QUOTA ||
      code === ErrorCodes.USER_ALREADY_HAVE_TRIAL_INSTANCE ||
      code === ErrorCodes.INSUFFICIENT_QUOTA ||
      code === ErrorCodes.INSUFFICIENT_STANDARD_QUOTA
    ) {
      setHasServiceRegistryCreationFailed(true);
    } else {
      addAlert &&
        addAlert({
          title: t('something_went_wrong'),
          variant: AlertVariant.danger,
          description: reason,
        });
    }
  };

  const validateCreateForm = () => {
    let isValid = true;
    const { name } = registryFormData;
    if (!name || name.trim() === '') {
      isValid = false;
      setNameValidated({
        fieldState: 'error',
        message: t('common:this_is_a_required_field'),
      });
    } else if (!/^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(name.trim())) {
      isValid = false;
      setNameValidated({
        fieldState: 'error',
        message: t('input_filed_invalid_helper_text'),
      });
    }

    if (name.length > MAX_SERVICE_REGISTRY_NAME_LENGTH) {
      isValid = false;
      setNameValidated({
        fieldState: 'error',
        message: t('service_registry_name_length_is_greater_than_expected', {
          maxLength: MAX_SERVICE_REGISTRY_NAME_LENGTH,
        }),
      });
    }

    return isValid;
  };

  const createServiceRegistry = async () => {
    const isValid = validateCreateForm();
    const accessToken = await auth?.srs.getToken();
    if (!isValid) {
      setIsFormValid(false);
      return;
    }
    if (accessToken) {
      const api = new RegistriesApi(
        new Configuration({
          accessToken,
          basePath,
        })
      );
      try {
        setCreationInProgress(true);
        await api.createRegistry({ name: registryFormData.name }).then(() => {
          hideModal();
          resetForm();
          fetchServiceRegistries && fetchServiceRegistries();
          setCreationInProgress(false);
        });
      } catch (error) {
        setCreationInProgress(false);
        handleServerError(error);
      }
    }
  };

  const handleCreateModal = () => {
    resetForm();
    hideModal();
  };

  const onFormSubmit: FormProps['onSubmit'] = (event) => {
    event.preventDefault();
    createServiceRegistry();
  };

  const createForm = () => {
    const { message, fieldState } = nameValidated;
    const { name } = registryFormData;

    return (
      <Form onSubmit={onFormSubmit}>
        {!isFormValid && (
          <FormAlert>
            <Alert
              variant='danger'
              title={t('common:form_invalid_alert')}
              aria-live='polite'
              isInline
            />
          </FormAlert>
        )}
        <FormGroup
          label='Name'
          isRequired
          fieldId='text-input-name'
          helperTextInvalid={message}
          validated={fieldState}
          helperText={t('input_filed_invalid_helper_text')}
        >
          <TextInput
            isRequired
            type='text'
            id='text-input-name'
            name='text-input-name'
            value={name}
            onChange={handleTextInputName}
            validated={fieldState}
            autoFocus={true}
          />
        </FormGroup>
      </Form>
    );
  };

  return (
    <MASCreateModal
      id='modalCreateSRegistry'
      isModalOpen={true}
      title={t('create_service_registry_instance')}
      handleModalToggle={handleCreateModal}
      onCreate={createServiceRegistry}
      isFormValid={isFormValid}
      primaryButtonTitle='Create'
      isCreationInProgress={isCreationInProgress}
      dataTestIdSubmit='modalCreateServiceRegistry-buttonSubmit'
      dataTestIdCancel='modalCreateServiceRegistry-buttonCancel'
      isDisabledButton={shouldDisabledButton}
    >
      <QuotaAlert
        quota={quota}
        hasServiceRegistryCreationFailed={hasServiceRegistryCreationFailed}
        loadingQuota={loadingQuota}
        hasUserTrialInstance={hasUserTrialInstance}
      />
      <Flex direction={{ default: 'column', lg: 'row' }}>
        <FlexItem flex={{ default: 'flex_2' }}> {createForm()}</FlexItem>
        <Divider isVertical />
        <FlexItem
          flex={{ default: 'flex_1' }}
          className='mk--create-instance-modal__sidebar--content'
        >
          <ServiceRegistryInformation isSrsTrial={isSrsTrial} />
        </FlexItem>
      </Flex>
    </MASCreateModal>
  );
};

export { CreateServiceRegistry };
export default CreateServiceRegistry;
