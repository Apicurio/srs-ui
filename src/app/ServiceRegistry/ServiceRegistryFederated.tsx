import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {ServiceRegistry} from './ServiceRegistry';
import {RootModal} from '@app/components';
import {BrowserRouter} from 'react-router-dom';
import srsi18n from '@i18n/i18n';
import {Registry} from "@rhoas/registry-management-sdk";

type ServiceRegistryFederatedProps = {
  render: (registry: Registry) => JSX.Element
}

const ServiceRegistryFederated: React.FC<ServiceRegistryFederatedProps> = ({render}) => {
  return (
      <I18nextProvider i18n={srsi18n}>
        <RootModal>
          <ServiceRegistry render={render}/>
        </RootModal>
      </I18nextProvider>
  );
};

export default ServiceRegistryFederated;
