import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ServiceRegistry } from './ServiceRegistry';
import { RootModal, PaginationProvider } from '@app/components';
import srsi18n from '@i18n/i18n';
import { SharedContext, SharedContextrops } from '@app/context';

type ServiceRegistryFederatedProps = SharedContextrops;

const ServiceRegistryFederated: React.FC<ServiceRegistryFederatedProps> = ({
  preCreateInstance,
  shouldOpenCreateModal,
  tokenEndPointUrl,
  renderDownloadArtifacts
}) => {
  return (
    <I18nextProvider i18n={srsi18n}>
      <SharedContext.Provider value={{ preCreateInstance, shouldOpenCreateModal, tokenEndPointUrl,renderDownloadArtifacts }}>
        <RootModal>
          <PaginationProvider>
            <ServiceRegistry />
          </PaginationProvider>
        </RootModal>
      </SharedContext.Provider>
    </I18nextProvider>
  );
};

export default ServiceRegistryFederated;
