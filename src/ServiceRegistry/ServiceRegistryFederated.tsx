import { FC } from 'react';
import { ModalProvider } from '@rhoas/app-services-ui-components';
import { ServiceRegistry } from './ServiceRegistry';
import {
  ServiceRegistryModalLoader,
  PaginationProvider,
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
      <ModalProvider>
        <PaginationProvider>
          <ServiceRegistry />
          <ServiceRegistryModalLoader />
        </PaginationProvider>
      </ModalProvider>
    </SharedContext.Provider>
  );
};

export default ServiceRegistryFederated;
