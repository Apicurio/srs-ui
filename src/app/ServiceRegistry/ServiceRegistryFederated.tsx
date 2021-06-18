import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ServiceRegistry, ServiceRegistryProps } from './ServiceRegistry';
import { RootModal } from '@app/components';
import srsi18n from '@i18n/i18n';

type ServiceRegistryFederatedProps = ServiceRegistryProps & {
  federatedModule?: string;
  navPrefixPath: string;
};

const ServiceRegistryFederated: React.FC<ServiceRegistryFederatedProps> = ({
  federatedModule,
  fetchRegistry,
  registry,
  children,
  navPrefixPath,
}) => {
  return (
    <I18nextProvider i18n={srsi18n}>
      <RootModal>
        <ServiceRegistry
          navPrefixPath={navPrefixPath}
          fetchRegistry={fetchRegistry}
          registry={registry}
          federatedModule={federatedModule}
        >
          {children}
        </ServiceRegistry>
      </RootModal>
    </I18nextProvider>
  );
};

export default ServiceRegistryFederated;
