import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Configuration, RegistryListRest, RegistryRest, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useBasename, useConfig } from '@bf2/ui-shared';
import { ServiceRegistryDrawer, UnauthrizedUser, WelcomeEmptyState } from './components';
import { ServiceRegistryHeader, ServiceRegistryHeaderProps } from '@app/ServiceRegistry/components';
import { MASLoading, useRootModalContext, MODAL_TYPES } from '@app/components';

export type ServiceRegistryProps = ServiceRegistryHeaderProps & {
  render: (registry: RegistryRest) => JSX.Element;
};

export const ServiceRegistry: React.FC<ServiceRegistryProps> = ({ render, breadcrumbId }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const history = useHistory();
  const basename = useBasename();
  const { showModal } = useRootModalContext();

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceAccountDetails, setServiceAccountDetails] = useState<any>(undefined);
  const [notRequiredDrawerContentBackground, setNotRequiredDrawerContentBackground] = useState<boolean>(false);
  const [isUnauthorizedUser, setIsUnauthorizedUser] = useState<boolean>(false);
  const [registry, setRegistry] = useState<RegistryListRest | undefined>(undefined);

  useEffect(() => {
    fetchRegistries();
  }, []);

  const fetchRegistries = async () => {
    const accessToken = await auth?.srs.getToken();
    const api = new RegistriesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );

    const registry = await api.getRegistries().then((res) => {
      return res?.data && res.data?.items[0];
    });
    setRegistry(registry);
    setLoading(false);
  };

  const onConnectToRegistry = () => {
    setIsExpandedDrawer(true);
    /**
     * Todo: Dummy test-data will remove after integrate API
     */
    setServiceAccountDetails(registry);
  };

  const onCloseDrawer = () => {
    setIsExpandedDrawer(false);
  };

  const deleteRegistry = async () => {
    /**
     * Todo: update getToken from auth?.srs.getToken() when available in ui-shared
     */
    const accessToken = await auth?.srs.getToken();
    if (registry?.id) {
      setLoading(true);
      const api = new RegistriesApi(
        new Configuration({
          accessToken,
          basePath,
        })
      );
      try {
        await api.deleteRegistry(registry?.id).then(() => {
          setLoading(false);
          history.push(basename.getBasename());
          fetchRegistries && fetchRegistries();
        });
      } catch (error) {
        setLoading(false);
        // TODO Swallowing the error
      }
    }
  };

  const onDeleteRegistry = () => {
    const { name, status } = registry;
    showModal(MODAL_TYPES.DELETE_SERVICE_REGISTRY, {
      serviceRegistryStatus: status,
      selectedItemData: registry,
      title: `${t('common.delete_service_registry_title')}?`,
      confirmButtonProps: {
        onClick: deleteRegistry,
        label: t('common.delete'),
        isLoading:loading
      },
      textProps: {
        description: t('common.delete_service_registry_description', { name }),
      },
    });
  };

  const getAccessToServiceRegistry = () => {
    /**
     * Todo: integrate get access service registry api
     */
  };

  if (isUnauthorizedUser) {
    return <UnauthrizedUser getAccessToServiceRegistry={getAccessToServiceRegistry} />;
  }

  if (loading) {
    return <MASLoading />;
  } else if (registry) {
    return (
      <ServiceRegistryDrawer
        isExpanded={isExpandedDrawer}
        isLoading={serviceAccountDetails === undefined}
        notRequiredDrawerContentBackground={notRequiredDrawerContentBackground}
        onClose={onCloseDrawer}
        registry={registry}
      >
        <ServiceRegistryHeader
          onConnectToRegistry={onConnectToRegistry}
          onDeleteRegistry={onDeleteRegistry}
          breadcrumbId={breadcrumbId}
        />
        {render(registry)}
      </ServiceRegistryDrawer>
    );
  } else {
    return <WelcomeEmptyState fetchServiceRegistries={fetchRegistries} />;
  }
};
