import React from 'react';
import {ServiceRegistry} from './ServiceRegistry';
import {AlertProvider} from '@app/components/MASAlerts';
import {Config, ConfigContext} from '@bf2/ui-shared';

declare const __BASE_PATH__: string;

export const ServiceRegistryConnected: React.FC = () => {

  return (
    <ConfigContext.Provider
      value={
        {
          srs: {
            apiBasePath: __BASE_PATH__,
          },
        } as Config
      }
    >
      <AlertProvider>
        <ServiceRegistry render={() => (<></>)} />
      </AlertProvider>
    </ConfigContext.Provider>
  );
};
