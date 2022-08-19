import { FC } from 'react';
import { ModalProvider } from '@rhoas/app-services-ui-components';
import { ApicurioRegistry, ApicurioRegistryProps } from './ApicurioRegistry';
import { ServiceRegistryModalLoader } from '@app/components';
import { SharedContext, SharedContextrops } from '@app/context';

type ApicurioRegistryFederatedProps = ApicurioRegistryProps & SharedContextrops;

const ApicurioRegistryFederated: FC<ApicurioRegistryFederatedProps> = ({
  render,
  breadcrumbId,
  tokenEndPointUrl,
  artifactId,
  renderDownloadArtifacts,
}) => {
  return (
    <SharedContext.Provider
      value={{ tokenEndPointUrl, artifactId, renderDownloadArtifacts }}
    >
      <ModalProvider>
        <ApicurioRegistry render={render} breadcrumbId={breadcrumbId} />
        <ServiceRegistryModalLoader />
      </ModalProvider>
    </SharedContext.Provider>
  );
};

export default ApicurioRegistryFederated;
