import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ServiceRegistryMapping } from './ServiceRegistryMapping';
import srsi18n from '@i18n/i18n';

const ServiceRegistryMappingFederated: React.FC = () => {
    return (
        <I18nextProvider i18n={srsi18n}>
            <ServiceRegistryMapping />
        </I18nextProvider>
    );
};

export default ServiceRegistryMappingFederated;
