import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ServiceRegistryMapping, ServiceRegistryMappingProps } from './ServiceRegistryMapping';
import srsi18n from '@i18n/i18n';

const ServiceRegistryMappingFederated: React.FC<ServiceRegistryMappingProps> = ({
  renderSchema,
  basename,
  topicName,
}) => {
  return (
    <I18nextProvider i18n={srsi18n}>
      <ServiceRegistryMapping renderSchema={renderSchema} basename={basename} topicName={topicName} />
    </I18nextProvider>
  );
};

export default ServiceRegistryMappingFederated;
