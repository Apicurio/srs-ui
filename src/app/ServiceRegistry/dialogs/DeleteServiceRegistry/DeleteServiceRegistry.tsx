import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RegistryRest, RegistriesApi, Configuration } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig, useBasename, useAlert, AlertVariant } from '@bf2/ui-shared';
import { MASDeleteModal, useRootModalContext } from '@app/components';
import { ServiceRegistryStatus, isServiceApiError } from '@app/utils';

export const DeleteServiceRegistry: React.FC = () => {
  const { t } = useTranslation();
  const { addAlert } = useAlert();
  const history = useHistory();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const basename = useBasename();
  const { store, hideModal } = useRootModalContext();
  const {
    title,
    confirmButtonProps,
    cancelButtonProps,
    textProps,
    serviceRegistryStatus,
    selectedItemData,
    onClose,
    fetchRegistries,
    shouldRedirect,
  } = store?.modalProps || {};

  const selectedInstanceName = selectedItemData?.name;

  const [instanceNameInput, setInstanceNameInput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleInstanceName = (value: string) => {
    setInstanceNameInput(value);
  };

  const isConfirmButtonDisabled = () => {
    if (serviceRegistryStatus?.toLowerCase() === ServiceRegistryStatus.Available) {
      if (instanceNameInput?.toLowerCase() === selectedInstanceName?.toLowerCase()) {
        return false;
      }
      return true;
    }
    return false;
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter' && !isConfirmButtonDisabled()) {
      confirmButtonProps?.onClick && confirmButtonProps.onClick(selectedItemData);
    }
  };

  const handleToggle = () => {
    setInstanceNameInput('');
    hideModal();
    onClose && onClose();
  };

  const handleServerError = (error: Error) => {
    let message: string | undefined;
    if (isServiceApiError(error)) {
      message = error.response?.data.reason;
    }
    addAlert({
      title: t('common.something_went_wrong'),
      variant: AlertVariant.danger,
      description: message,
    });
  };

  const deleteRegistry = async (registry: RegistryRest) => {
    const { id, name } = registry;
    const accessToken = await auth?.srs.getToken();
    if (id) {
      setLoading(true);
      const api = new RegistriesApi(
        new Configuration({
          accessToken,
          basePath,
        })
      );

      await api
        .deleteRegistry('')
        .then(() => {
          setLoading(false);
          addAlert({
            title: t('srs.service_registry_deletion_success_message', { name }),
            variant: AlertVariant.success,
          });
          fetchRegistries && fetchRegistries();
          shouldRedirect && history.push(basename.getBasename());
          handleToggle();
        })
        .catch((error) => {
          setLoading(false);
          handleServerError(error);
        });
    }
  };

  return (
    <MASDeleteModal
      isModalOpen={true}
      title={title}
      confirmButtonProps={{
        isDisabled: isConfirmButtonDisabled(),
        'data-testid': 'modalDeleteRegistry-buttonDelete',
        ...confirmButtonProps,
        onClick: deleteRegistry,
        isLoading: loading,
      }}
      cancelButtonProps={cancelButtonProps}
      handleModalToggle={handleToggle}
      textProps={textProps}
      selectedItemData={selectedItemData}
      textInputProps={{
        showTextInput: serviceRegistryStatus?.toLowerCase() === ServiceRegistryStatus.Available,
        label: t('common.service_registry_name_label', { name: selectedInstanceName }),
        value: instanceNameInput,
        onChange: handleInstanceName,
        onKeyPress,
        autoFocus: true,
      }}
    ></MASDeleteModal>
  );
};
