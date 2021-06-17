import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ServiceRegistry, ServiceRegistryProps } from './ServiceRegistry';
import { RootModal } from '@app/components';
import srsi18n from '@i18n/i18n';

const getNavPrefixPath = () => {
  const pathname = window.location.pathname;
  let release = '/';
  const pathName = pathname.split('/');
  pathName.shift();
  if (pathName[0] === 'beta') {
    pathName.shift();
    release = `/beta/`;
  }
  return `${release}application-services/sr`;
};

type ServiceRegistryFederatedProps = ServiceRegistryProps & {
  federatedModule?: string;
};

const ServiceRegistryFederated: React.FC<ServiceRegistryFederatedProps> = ({
  federatedModule,
  fetchRegistry,
  registry,
  children,
}) => {
  const navPrefixPath = getNavPrefixPath();
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default ServiceRegistryFederated;
