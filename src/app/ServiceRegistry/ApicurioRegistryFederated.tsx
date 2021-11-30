import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ApicurioRegistry, ApicurioRegistryProps } from './ApicurioRegistry';
import { RootModal } from '@app/components';
import srsi18n from '@i18n/i18n';
import { SharedContext, SharedContextrops } from '@app/context';

type ApicurioRegistryFederatedProps = ApicurioRegistryProps & SharedContextrops;

const ApicurioRegistryFederated: React.FC<ApicurioRegistryFederatedProps> = ({
  render,
  breadcrumbId,
  tokenEndPointUrl,
  artifactId,
  renderDownloadArtifacts
}) => {
  return (
    <I18nextProvider i18n={srsi18n}>
      <RootModal>
        <SharedContext.Provider value={{ tokenEndPointUrl, artifactId, renderDownloadArtifacts }}>
          <ApicurioRegistry render={render} breadcrumbId={breadcrumbId} />
        </SharedContext.Provider>
      </RootModal>
    </I18nextProvider>
  );
};

export default ApicurioRegistryFederated;
