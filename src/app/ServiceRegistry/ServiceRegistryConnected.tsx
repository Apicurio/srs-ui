import React from 'react';
import { useParams } from 'react-router-dom';
import { ServiceRegistry } from './ServiceRegistry';
import { ServiceRegistryParams } from './components';
import { AlertProvider } from '@app/components/MASAlerts';
import { Config, ConfigContext } from '@bf2/ui-shared';

declare const __BASE_PATH__: string;

type ServiceRegistryConnectedProps = {
  federatedComponent?: string;
};

export const ServiceRegistryConnected: React.FC<ServiceRegistryConnectedProps> = ({ federatedComponent }) => {
  const params = useParams<ServiceRegistryParams>();

  return (
    <ConfigContext.Provider
      value={
        {
          kas: {
            apiBasePath: __BASE_PATH__,
          },
        } as Config
      }
    >
      <AlertProvider>
        <ServiceRegistry params={params} activeFederatedModule={federatedComponent} />
      </AlertProvider>
    </ConfigContext.Provider>
  );
};
