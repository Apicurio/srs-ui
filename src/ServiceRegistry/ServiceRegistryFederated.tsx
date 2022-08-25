import { FC } from 'react';
import { ServiceRegistry } from './ServiceRegistry';
import {
  ServiceRegistryModalLoader,
  PaginationProvider,
  ModalProvider,
} from '@app/components';
import { SharedContext, SharedContextrops } from '@app/context';

type ServiceRegistryFederatedProps = SharedContextrops;

const ServiceRegistryFederated: FC<ServiceRegistryFederatedProps> = ({
  preCreateInstance,
  shouldOpenCreateModal,
  tokenEndPointUrl,
  renderDownloadArtifacts,
}) => {
  return (
    <SharedContext.Provider
      value={{
        preCreateInstance,
        shouldOpenCreateModal,
        tokenEndPointUrl,
        renderDownloadArtifacts,
      }}
    >
      <PaginationProvider>
        <ModalProvider>
          <ServiceRegistry />
          <ServiceRegistryModalLoader />
        </ModalProvider>
      </PaginationProvider>
    </SharedContext.Provider>
  );
};

export default ServiceRegistryFederated;
