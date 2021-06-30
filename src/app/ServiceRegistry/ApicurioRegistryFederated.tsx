import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ApicurioRegistry, ApicurioRegistryProps } from './ApicurioRegistry';
import { RootModal } from '@app/components';
import srsi18n from '@i18n/i18n';

type ApicurioRegistryFederatedProps = ApicurioRegistryProps;

const ApicurioRegistryFederated: React.FC<ApicurioRegistryFederatedProps> = ({ render, breadcrumbId, registry }) => {
  return (
    <I18nextProvider i18n={srsi18n}>
      <RootModal>
        <ApicurioRegistry render={render} breadcrumbId={breadcrumbId} registry={registry} />
      </RootModal>
    </I18nextProvider>
  );
};

export default ApicurioRegistryFederated;
