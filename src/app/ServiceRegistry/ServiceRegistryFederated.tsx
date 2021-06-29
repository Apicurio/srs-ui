import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ServiceRegistry } from './ServiceRegistry';
import { RootModal } from '@app/components';
import srsi18n from '@i18n/i18n';

const ServiceRegistryFederated: React.FC = () => {
  return (
    <I18nextProvider i18n={srsi18n}>
      <RootModal>
        <ServiceRegistry />
      </RootModal>
    </I18nextProvider>
  );
};

export default ServiceRegistryFederated;
