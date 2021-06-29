import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistryRest } from '@rhoas/registry-management-sdk';
import { ServiceRegistryDrawer, ServiceRegistryHeader } from './components';
import { useRootModalContext, MODAL_TYPES } from '@app/components';

export type ApicurioRegistryProps = {
  render: (registry: RegistryRest) => JSX.Element;
  registry: RegistryRest;
  breadcrumbId: string;
};

const ApicurioRegistry: React.FC<ApicurioRegistryProps> = ({ render, registry, breadcrumbId }) => {
  const { t } = useTranslation();
  const { showModal } = useRootModalContext();
  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);

  const onConnectToRegistry = (instance: RegistryRest) => {
    setIsExpandedDrawer(true);
  };

  const onCloseDrawer = () => {
    setIsExpandedDrawer(false);
  };

  const onDeleteRegistry = (registry: RegistryRest) => {
    const { name, status } = registry;
    showModal(MODAL_TYPES.DELETE_SERVICE_REGISTRY, {
      shouldRedirect: true,
      serviceRegistryStatus: status,
      selectedItemData: registry,
      title: `${t('common.delete_service_registry_title')}?`,
      confirmButtonProps: {
        label: t('common.delete'),
      },
      textProps: {
        description: t('common.delete_service_registry_description', { name }),
      },
    });
  };

  return (
    <ServiceRegistryDrawer
      isExpanded={isExpandedDrawer}
      isLoading={registry === undefined}
      onClose={onCloseDrawer}
      registry={registry}
    >
      <ServiceRegistryHeader
        onConnectToRegistry={onConnectToRegistry}
        onDeleteRegistry={onDeleteRegistry}
        breadcrumbId={breadcrumbId}
        serviceRegistryDetails={registry}
      />
      {render && render(registry)}
    </ServiceRegistryDrawer>
  );
};

export { ApicurioRegistry };
