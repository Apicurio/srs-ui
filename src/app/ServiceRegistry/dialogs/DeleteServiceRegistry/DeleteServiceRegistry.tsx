import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { RegistryRest, RegistriesApi, Configuration, RegistryStatusValueRest } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig, useBasename, useAlert, AlertVariant } from '@rhoas/app-services-ui-shared';
import { MASDeleteModal, useRootModalContext } from '@app/components';
import { isServiceApiError } from '@app/utils';
import { useSharedContext } from '@app/context';

export const DeleteServiceRegistry: React.FC = () => {
  const { t } = useTranslation();
  const { addAlert } = useAlert() || { addAlert: () => '' };
  const history = useHistory();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig() || { srs: { apiBasePath: '' } };
  const basename = useBasename() || { getBasename: () => '' };
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

  const { renderDownloadArtifacts } = useSharedContext() || {};

  const selectedInstanceName = selectedItemData?.name;

  const [instanceNameInput, setInstanceNameInput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleInstanceName = (value: string) => {
    setInstanceNameInput(value);
  };

  const isConfirmButtonDisabled = () => {
    if (serviceRegistryStatus?.toLowerCase() === RegistryStatusValueRest.Ready) {
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
        .deleteRegistry(id)
        .then(() => {
          setLoading(false);
          addAlert({
            title: t('srs.service_registry_deletion_success_message', { name }),
            variant: AlertVariant.success,
          });
          if (shouldRedirect) {
            history.push(basename.getBasename());
          } else {
            fetchRegistries && fetchRegistries();
          }
          handleToggle();
        })
        .catch((error) => {
          setLoading(false);
          handleServerError(error);
        });
    }
  };

  const description = (
    <>
      <TextContent className="pf-u-mb-md pf-u-mb-xs">
        <Text component={TextVariants.p}>
          <span
            dangerouslySetInnerHTML={{
              __html: t('common.delete_service_registry_description', { name: selectedInstanceName }),
            }}
          />
        </Text>
        <Text component={TextVariants.p} className="pf-u-font-size-sm">
          {t('common.delete_service_registry_download_zip')}
          &nbsp;
          {renderDownloadArtifacts && renderDownloadArtifacts(selectedItemData, t('common.download_artifacts'))}
        </Text>
      </TextContent>
    </>
  );

  const newTextProps = {
    ...textProps,
    description,
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
      textProps={newTextProps}
      selectedItemData={selectedItemData}
      textInputProps={{
        showTextInput: serviceRegistryStatus?.toLowerCase() === RegistryStatusValueRest.Ready,
        label: t('common.service_registry_name_label', { name: selectedInstanceName }),
        value: instanceNameInput,
        onChange: handleInstanceName,
        onKeyPress,
        autoFocus: true,
      }}
    ></MASDeleteModal>
  );
};
