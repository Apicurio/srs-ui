import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ServiceRegistry } from './ServiceRegistry';
import { RootModal } from '@app/components';
import srsi18n from '@i18n/i18n';
import { RegistryRest } from '@rhoas/registry-management-sdk';

type ServiceRegistryFederatedProps = {
  render: (registry: RegistryRest) => JSX.Element;
  breadcrumbId: string;
};

const ServiceRegistryFederated: React.FC<ServiceRegistryFederatedProps> = ({ render, breadcrumbId }) => {
  return (
    <I18nextProvider i18n={srsi18n}>
      <RootModal>
        <ServiceRegistry render={render} breadcrumbId={breadcrumbId} />
      </RootModal>
    </I18nextProvider>
  );
};

export default ServiceRegistryFederated;
