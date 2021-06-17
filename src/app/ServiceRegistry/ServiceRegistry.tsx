import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DefaultApi, Configuration, Registry } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@bf2/ui-shared';
import { ServiceRegistryDrawer, UnauthrizedUser, WelcomeEmptyState } from './components';
import { ServiceRegistryHeader, ServiceRegistryHeaderProps } from '@app/ServiceRegistry/components';

export type ServiceRegistryProps = ServiceRegistryHeaderProps & {
  fetchRegistry?: () => Promise<void>;
  registry?: Registry;
};

export const ServiceRegistry: React.FC<ServiceRegistryProps> = ({
  navPrefixPath,
  showBreadcrumb,
  activeBreadcrumbItemLabel,
  registry,
  fetchRegistry,
  federatedModule,
  children,
}) => {
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const history = useHistory();

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serviceAccountDetails, setServiceAccountDetails] = useState<any>(undefined);
  const [notRequiredDrawerContentBackground, setNotRequiredDrawerContentBackground] = useState<boolean>(false);
  const [isUnauthorizedUser, setIsUnauthorizedUser] = useState<boolean>(false);

  const createServiceRegistry = async () => {
    /**
     * Todo: remove registryName hard code after create fomr integrate
     */
    const registryName = 'tenant-15';
    const accessToken = await auth?.srs.getToken();
    const api = new DefaultApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    try {
      setIsLoading(true);
      await api.createRegistry({ name: registryName }).then(() => {
        fetchRegistry && fetchRegistry();
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
    const accessToken = await auth?.srs.getToken();
    if (registry?.id) {
      const api = new DefaultApi(
        new Configuration({
          accessToken,
          basePath,
        })
      );
      try {
        await api.deleteRegistry(registry?.id).then(() => {
          history.push(navPrefixPath || '/');
          fetchRegistry && fetchRegistry();
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
          <ServiceRegistryHeader
            onConnectToRegistry={onConnectToRegistry}
            onDeleteRegistry={onDeleteRegistry}
            showBreadcrumb={showBreadcrumb}
            activeBreadcrumbItemLabel={activeBreadcrumbItemLabel}
            navPrefixPath={navPrefixPath}
            federatedModule={federatedModule}
          />
          {children}
        </ServiceRegistryDrawer>
      );
    } else {
      return <WelcomeEmptyState createServiceRegistry={createServiceRegistry} isLoading={isLoading} />;
    }
  };

  return <>{renderView()}</>;
};
