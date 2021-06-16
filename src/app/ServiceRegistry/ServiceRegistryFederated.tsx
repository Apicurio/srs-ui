import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ServiceRegistry, ServiceRegistryProps } from './ServiceRegistry';
import { RootModal } from '@app/components';
import srsi18n from '@i18n/i18n';

function getBaseName() {
  const pathname = window.location.pathname;
  let release = '/';
  const pathName = pathname.split('/');
  pathName.shift();
  if (pathName[0] === 'beta') {
    pathName.shift();
    release = `/beta/`;
  }
  return `${release}application-services/sr`;
}

type ServiceRegistryFederatedProps = ServiceRegistryProps & {
  federatedModule?: string;
};

const ServiceRegistryFederated: React.FC<ServiceRegistryFederatedProps> = ({ params, federatedModule }) => {
  const baseName = getBaseName();
  return (
    <BrowserRouter>
      <I18nextProvider i18n={srsi18n}>
        <RootModal>
          <ServiceRegistry
            baseUIPath={baseName}
            params={params}
            homeLinkPath={baseName}
            activeFederatedModule={federatedModule}
          />
        </RootModal>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default ServiceRegistryFederated;
