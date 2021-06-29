import React, { useState, useEffect } from 'react';
import { Alert, Form, FormAlert, FormGroup, TextInput, TextArea, AlertVariant } from '@patternfly/react-core';
import { Configuration, RegistriesApi } from '@rhoas/registry-management-sdk';
import { NewServiceregistry, FormDataValidationState } from '@app/models';
import { MASCreateModal, useRootModalContext } from '@app/components';
import { useTranslation } from 'react-i18next';
import { isServiceApiError, MAX_SERVICE_REGISTRY_NAME_LENGTH, MAX_SERVICE_REGISTRY_DESC_LENGTH } from '@app/utils';
import { useAlert, useAuth, useConfig } from '@bf2/ui-shared';

const CreateServiceRegistry: React.FC = () => {
  const newServiceRegistry: NewServiceregistry = new NewServiceregistry();
  const { store, hideModal } = useRootModalContext();
  const { fetchServiceRegistries } = store?.modalProps || {};
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const { addAlert } = useAlert();

  const [nameValidated, setNameValidated] = useState<FormDataValidationState>({ fieldState: 'default' });
  const [descriptionValidated, setDescriptionValidated] = useState<FormDataValidationState>({ fieldState: 'default' });
  const [registryFormData, setRegistryFormData] = useState<NewServiceregistry>(newServiceRegistry);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [isCreationInProgress, setCreationInProgress] = useState(false);

  const resetForm = () => {
    setNameValidated({ fieldState: 'default' });
    setDescriptionValidated({ fieldState: 'default' });
    setRegistryFormData(newServiceRegistry);
    setIsFormValid(true);
  };

  useEffect(() => {
    if (nameValidated.fieldState !== 'error' && descriptionValidated.fieldState !== 'error') {
      setIsFormValid(true);
    }
  }, [nameValidated.fieldState, descriptionValidated.fieldState]);

  const handleTextInputName = (name: string) => {
    setRegistryFormData({ ...registryFormData, name });
    let isValid = true;
    if (name && !/^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(name.trim())) {
      isValid = false;
    }

    if (name && name.length > MAX_SERVICE_REGISTRY_NAME_LENGTH) {
      setNameValidated({
        fieldState: 'error',
        message: t('srs.service_registry_name_length_is_greater_than_expected', {
          maxLength: MAX_SERVICE_REGISTRY_NAME_LENGTH,
        }),
      });
    } else if (isValid && nameValidated.fieldState === 'error') {
      setNameValidated({ fieldState: 'default', message: '' });
    } else if (!isValid) {
      setNameValidated({ fieldState: 'error', message: t('common.input_filed_invalid_helper_text') });
    }
  };

  const handleServerError = (error: Error) => {
    let reason: string | undefined;
    if (isServiceApiError(error)) {
      reason = error.response?.data.reason;
    }
    addAlert({
      title: t('something_went_wrong'),
      variant: AlertVariant.danger,
      description: reason,
    });
  };

  const handleTextInputDescription = (description: string) => {
    setRegistryFormData({ ...registryFormData, description });
    let isValid = true;
    if (description && !/^[a-zA-Z0-9.,\-\s]*$/.test(description.trim())) {
      isValid = false;
    }
    if (description && description.length > MAX_SERVICE_REGISTRY_DESC_LENGTH) {
      setDescriptionValidated({
        fieldState: 'error',
        message: t('srs.service_registry_description_length_is_greater_than_expected', {
          maxLength: MAX_SERVICE_REGISTRY_DESC_LENGTH,
        }),
      });
    } else if (isValid && descriptionValidated.fieldState === 'error') {
      setDescriptionValidated({
        fieldState: 'default',
        message: '',
      });
    } else if (!isValid) {
      setDescriptionValidated({
        fieldState: 'error',
        message: t('common.input_text_area_invalid_helper_text'),
      });
    }
  };

  const validateCreateForm = () => {
    let isValid = true;
    const { name, description } = registryFormData;
    if (!name || name.trim() === '') {
      isValid = false;
      setNameValidated({ fieldState: 'error', message: t('common.this_is_a_required_field') });
    } else if (!/^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(name.trim())) {
      isValid = false;
      setNameValidated({
        fieldState: 'error',
        message: t('common.input_filed_invalid_helper_text'),
      });
    } else if (!/^[a-zA-Z0-9.,\-\s]*$/.test(description.trim())) {
      isValid = false;
      setDescriptionValidated({
        fieldState: 'error',
        message: t('common.input_text_area_invalid_helper_text'),
      });
    }

    if (name.length > MAX_SERVICE_REGISTRY_NAME_LENGTH) {
      isValid = false;
      setNameValidated({
        fieldState: 'error',
        message: t('srs.service_registry_name_length_is_greater_than_expected', {
          maxLength: MAX_SERVICE_REGISTRY_NAME_LENGTH,
        }),
      });
    }

    if (description && description.length > MAX_SERVICE_REGISTRY_DESC_LENGTH) {
      isValid = false;
      setDescriptionValidated({
        fieldState: 'error',
        message: t('srs.service_registry_desc_length_is_greater_than_expected', {
          maxLength: MAX_SERVICE_REGISTRY_DESC_LENGTH,
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
          addAlert({
            title: t('srs.service_registry_creation_success_message'),
            variant: AlertVariant.success,
          });
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

  const onFormSubmit = (event) => {
    event.preventDefault();
    createServiceRegistry();
  };

  const createForm = () => {
    const { message, fieldState } = nameValidated;
    const { name, description } = registryFormData;
    const { message: descMessage, fieldState: descFieldState } = descriptionValidated;
    return (
      <Form onSubmit={onFormSubmit}>
        {!isFormValid && (
          <FormAlert>
            <Alert variant="danger" title={t('common.form_invalid_alert')} aria-live="polite" isInline />
          </FormAlert>
        )}
        <FormGroup
          label="Name"
          isRequired
          fieldId="text-input-name"
          helperTextInvalid={message}
          validated={fieldState}
          helperText={t('common.input_filed_invalid_helper_text')}
        >
          <TextInput
            isRequired
            type="text"
            id="text-input-name"
            name="text-input-name"
            value={name}
            onChange={handleTextInputName}
            validated={fieldState}
            autoFocus={true}
          />
        </FormGroup>
        <FormGroup
          label="Description"
          fieldId="text-input-description"
          helperTextInvalid={descMessage}
          validated={descFieldState}
          helperText={t('common.input_text_area_invalid_helper_text')}
        >
          <TextArea
            id="text-input-description"
            name="text-input-description"
            value={description}
            onChange={handleTextInputDescription}
            validated={descFieldState}
          />
        </FormGroup>
      </Form>
    );
  };

  return (
    <MASCreateModal
      id="modalCreateSRegistry"
      isModalOpen={true}
      title={t('srs.create_service_registry_instance')}
      handleModalToggle={handleCreateModal}
      onCreate={createServiceRegistry}
      isFormValid={isFormValid}
      primaryButtonTitle="Create"
      isCreationInProgress={isCreationInProgress}
      dataTestIdSubmit="modalCreateServiceRegistry-buttonSubmit"
      dataTestIdCancel="modalCreateServiceRegistry-buttonCancel"
    >
      {createForm()}
    </MASCreateModal>
  );
};

export { CreateServiceRegistry };
