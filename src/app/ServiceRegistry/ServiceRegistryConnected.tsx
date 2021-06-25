import React from 'react';
import { ServiceRegistry } from './ServiceRegistry';
import { AlertProvider } from '@app/components/MASAlerts';

export const ServiceRegistryConnected: React.FC = () => {
  return (
    <AlertProvider>
      <ServiceRegistry render={() => <></>} />
    </AlertProvider>
  );
};
