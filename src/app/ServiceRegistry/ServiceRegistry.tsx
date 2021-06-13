import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageSection, ButtonVariant } from '@patternfly/react-core';
import { MASEmptyState, MASEmptyStateVariant } from '@app/components';
import {
  ServiceRegistryHeader,
  ServiceRegistryDrawer,
  FederatedModuleManager,
  FederatedModuleManagerProps,
} from './components';
import { DefaultApi, Configuration } from '@rhoas/registry-management-sdk';
import { useAuth } from '@bf2/ui-shared';

export type ServiceRegistryProps = Pick<
  FederatedModuleManagerProps,
  'params' | 'homeLinkPath' | 'baseUIPath' | 'navPrefixPath'
>;

export const ServiceRegistry: React.FC<ServiceRegistryProps> = ({
  navPrefixPath,
  baseUIPath,
  params,
  homeLinkPath,
}) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const history = useHistory();

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serviceAccountDetails, setServiceAccountDetails] = useState<any>(undefined);
  const [notRequiredDrawerContentBackground, setNotRequiredDrawerContentBackground] = useState<boolean>(false);
  const [isUnauthorizedUser, setIsUnauthorizedUser] = useState<boolean>(false);
  const [registry, setRegistry] = useState();
  const basePath = 'http://localhost:9090';
  const { name: tenantId } = registry || {};
  const registryId = 'tenant-15';

  useEffect(() => {
    fetchRegistry();
  }, []);

  const fetchRegistry = async () => {
    const accessToken = await auth?.kas.getToken();
    const api = new DefaultApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await api.getRegistries().then((res) => {
      const response = res?.data && res.data[0];
      setRegistry(response);
    });
  };

  const createServiceRegistry = async () => {
    const accessToken = await auth?.kas.getToken();
    const api = new DefaultApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    try {
      setIsLoading(true);
      await api.createRegistry({ name: registryId }).then(() => {
        fetchRegistry();
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
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
    const accessToken = await auth?.kas.getToken();
    const api = new DefaultApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    try {
      await api.deleteRegistry(registry?.id).then(() => {
        history.push(homeLinkPath || '/');
        fetchRegistry();
      });
    } catch (error) {}
  };

  const onDeleteRegistry = () => {
    deleteRegistry();
  };

  const getAccessToServiceRegistry = () => {
    /**
     * Todo: integrate get access service registry api
     */
  };

  const renderWelcomeEmptyState = () => {
    return (
      <PageSection padding={{ default: 'noPadding' }} isFilled>
        <MASEmptyState
          emptyStateProps={{ variant: MASEmptyStateVariant.GettingStarted }}
          titleProps={{ title: t('serviceRegistry.welcome_to_service_registry') }}
          emptyStateBodyProps={{
            body: t('serviceRegistry.welcome_empty_state_body'),
          }}
          buttonProps={{
            title: t('serviceRegistry.create_service_registry'),
            variant: ButtonVariant.primary,
            onClick: createServiceRegistry,
            isLoading: isLoading,
            spinnerAriaValueText: isLoading ? t('common.loading') : undefined,
          }}
        />
      </PageSection>
    );
  };

  const renderUnauthorizedUserEmptyState = () => {
    return (
      <>
        <ServiceRegistryHeader showKebab={false} />
        <PageSection padding={{ default: 'noPadding' }} isFilled>
          <MASEmptyState
            emptyStateProps={{ variant: MASEmptyStateVariant.NoAccess }}
            titleProps={{ title: t('serviceRegistry.unauthorized_empty_state_title') }}
            emptyStateBodyProps={{
              body: t('serviceRegistry.unauthorized_empty_state_body'),
            }}
            buttonProps={{
              title: t('serviceRegistry.get_access_to_service_registry'),
              variant: ButtonVariant.primary,
              onClick: getAccessToServiceRegistry,
            }}
          />
        </PageSection>
      </>
    );
  };

  if (isUnauthorizedUser) {
    return renderUnauthorizedUserEmptyState();
  }

  const renderView = () => {
    if (registry) {
      return (
        <ServiceRegistryDrawer
          isExpanded={isExpandedDrawer}
          isLoading={serviceAccountDetails === undefined}
          notRequiredDrawerContentBackground={notRequiredDrawerContentBackground}
          onClose={onCloseDrawer}
        >
          <FederatedModuleManager
            tenantId={tenantId}
            baseUIPath={baseUIPath}
            params={params}
            onConnectToRegistry={onConnectToRegistry}
            onDeleteRegistry={onDeleteRegistry}
            homeLinkPath={homeLinkPath}
          />
        </ServiceRegistryDrawer>
      );
    } else {
      return renderWelcomeEmptyState();
    }
  };

  return <>{renderView()}</>;
};
