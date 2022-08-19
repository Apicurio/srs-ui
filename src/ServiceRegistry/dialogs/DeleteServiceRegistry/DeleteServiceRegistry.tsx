import { useState, FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TextContent,
  Text,
  TextVariants,
  Alert,
  AlertActionLink,
  TextInputProps,
} from '@patternfly/react-core';
import {
  Registry,
  RegistriesApi,
  Configuration,
  RegistryStatusValue,
} from '@rhoas/registry-management-sdk';
import {
  useAuth,
  useConfig,
  useBasename,
  useAlert,
  AlertVariant,
} from '@rhoas/app-services-ui-shared';
import {
  MASDeleteModal,
  useModal,
  BaseModalProps,
  DeleteServiceRegistryProps,
} from '@app/components';
import { isServiceApiError } from '@app/utils';

const DeleteServiceRegistry: FunctionComponent<
  BaseModalProps & DeleteServiceRegistryProps
> = ({
  title = '',
  confirmButtonProps,
  status,
  registry,
  fetchServiceRegistries,
  shouldRedirect,
  renderDownloadArtifacts,
}) => {
  const { t } = useTranslation();
  const { addAlert } = useAlert();
  const history = useHistory();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const basename = useBasename();
  const { hideModal } = useModal();

  const selectedInstanceName = registry?.name;

  const [instanceNameInput, setInstanceNameInput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  const onClickDownload = () => {
    setIsDownloaded(true);
  };

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const onChangeCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleInstanceName = (value: string) => {
    setInstanceNameInput(value);
  };

  const isConfirmButtonDisabled = () => {
    if (status?.toLowerCase() === RegistryStatusValue.Ready) {
      if (
        instanceNameInput?.toLowerCase() ===
          selectedInstanceName?.toLowerCase() &&
        isChecked
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  const onKeyPress: TextInputProps['onKeyPress'] = (event) => {
    if (event.key === 'Enter' && !isConfirmButtonDisabled() && registry) {
      deleteRegistry(registry);
    }
  };

  const handleToggle = () => {
    setInstanceNameInput('');
    hideModal();
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

  const deleteRegistry = async (registry: Registry) => {
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
            fetchServiceRegistries && fetchServiceRegistries();
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
      <TextContent className='pf-u-mb-md pf-u-mb-xs'>
        <Text component={TextVariants.p}>
          <span
            dangerouslySetInnerHTML={{
              __html: t('common.delete_service_registry_description', {
                name: selectedInstanceName,
              }),
            }}
          />
        </Text>
      </TextContent>
      <Alert
        variant='info'
        isInline
        className='pf-u-mb-lg'
        title={t('common.delete_instance_alert_header')}
        actionLinks={
          <AlertActionLink onClick={onClickDownload}>
            {renderDownloadArtifacts &&
              registry &&
              renderDownloadArtifacts(registry, t('common.download_artifacts'))}
          </AlertActionLink>
        }
      >
        {t('common.delete_instance_alert_body')}
      </Alert>
    </>
  );

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
      handleModalToggle={handleToggle}
      textProps={description}
      selectedItemData={registry}
      textInputProps={{
        showTextInput: status?.toLowerCase() === RegistryStatusValue.Ready,
        label: t('common.service_registry_name_label', {
          name: selectedInstanceName,
        }),
        value: instanceNameInput,
        onChange: handleInstanceName,
        onKeyPress,
        autoFocus: true,
      }}
      checkboxProps={{
        id: 'checkbox',
        isDownloaded: isDownloaded,
        isChecked: isChecked,
        onChange: onChangeCheckbox,
      }}
    ></MASDeleteModal>
  );
};

export { DeleteServiceRegistry };
export default DeleteServiceRegistry;
