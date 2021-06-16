import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { DefaultApi, Configuration, Registry } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@bf2/ui-shared';
import {
  ServiceRegistryDrawer,
  FederatedModuleManager,
  FederatedModuleManagerProps,
  UnauthrizedUser,
  WelcomeEmptyState,
} from './components';
import { ServiceRegistryHeader } from '@app/ServiceRegistry/components';

export type ServiceRegistryProps = FederatedModuleManagerProps;

export const ServiceRegistry: React.FC<ServiceRegistryProps> = ({
  baseUIPath,
  params,
  homeLinkPath,
  showBreadcrumb,
  activeFederatedModule,
  activeBreadcrumbItemLabel,
}) => {
  const auth = useAuth();
  // const {
  //   srs: { apiBasePath: basePath },
  // } = useConfig();
  const history = useHistory();

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serviceAccountDetails, setServiceAccountDetails] = useState<any>(undefined);
  const [notRequiredDrawerContentBackground, setNotRequiredDrawerContentBackground] = useState<boolean>(false);
  const [isUnauthorizedUser, setIsUnauthorizedUser] = useState<boolean>(false);
  const [registry, setRegistry] = useState<Registry>();
  const basePath = 'https://api.stage.openshift.com';
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
    if (registry?.id) {
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
    }
  };

  const onDeleteRegistry = () => {
    deleteRegistry();
  };

  const getAccessToServiceRegistry = () => {
    /**
     * Todo: integrate get access service registry api
     */
  };

  if (isUnauthorizedUser) {
    return <UnauthrizedUser getAccessToServiceRegistry={getAccessToServiceRegistry} />;
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
          {/* <FederatedModuleManager
            tenantId={tenantId}
            baseUIPath={baseUIPath}
            params={params}
            onConnectToRegistry={onConnectToRegistry}
            onDeleteRegistry={onDeleteRegistry}
            homeLinkPath={homeLinkPath}
            activeFederatedModule={activeFederatedModule}
          /> */}
          <ServiceRegistryHeader
            onConnectToRegistry={onConnectToRegistry}
            onDeleteRegistry={onDeleteRegistry}
            showBreadcrumb={showBreadcrumb}
            activeBreadcrumbItemLabel={activeBreadcrumbItemLabel}
            homeLinkPath={homeLinkPath}
          />
        </ServiceRegistryDrawer>
      );
    } else {
      return <WelcomeEmptyState createServiceRegistry={createServiceRegistry} isLoading={isLoading} />;
    }
  };

  return <>{renderView()}</>;
};
