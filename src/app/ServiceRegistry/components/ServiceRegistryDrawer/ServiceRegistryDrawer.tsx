import React from 'react';
import { useTranslation } from 'react-i18next';
import { Registry } from '@rhoas/registry-management-sdk';
import { MASDrawer, MASDrawerProps } from '@app/components';
import { ConnectionInfo } from './ConnectionInfo';

export type ServiceRegistryDrawerProps = Omit<
  MASDrawerProps,
  'drawerHeaderProps' | 'panelBodyContent' | '[data-ouia-app-id]'
> & {
  activeTab?: React.ReactText;
  registry: Registry | undefined;
};

const ServiceRegistryDrawer: React.FC<ServiceRegistryDrawerProps> = ({
  isExpanded,
  isLoading,
  onClose,
  'data-ouia-app-id': dataOuiaAppId,
  children,
  notRequiredDrawerContentBackground,
  registry,
}: ServiceRegistryDrawerProps) => {
  const { t } = useTranslation();
  const { registryUrl, name } = registry || {};

  const panelBodyContent = <ConnectionInfo registryApisUrl={registryUrl} />;

  return (
    <MASDrawer
      isExpanded={isExpanded}
      isLoading={isLoading}
      onClose={onClose}
      panelBodyContent={panelBodyContent}
      drawerHeaderProps={{
        text: { label: t('srs.service_registry_instance_name') },
        title: { value: name, headingLevel: 'h1' },
      }}
      data-ouia-app-id={dataOuiaAppId}
      notRequiredDrawerContentBackground={notRequiredDrawerContentBackground}
    >
      {children}
    </MASDrawer>
  );
};

export { ServiceRegistryDrawer };
