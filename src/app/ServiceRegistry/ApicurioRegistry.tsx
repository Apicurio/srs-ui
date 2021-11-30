import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { Configuration, Registry, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceRegistryDrawer, ServiceRegistryHeader } from './components';
import { useRootModalContext, MODAL_TYPES, MASLoading } from '@app/components';
import {useSharedContext} from '@app/context';

export type ApicurioRegistryProps = {
  render: (registry: Registry | undefined) => JSX.Element;
  breadcrumbId: string;
};

const ApicurioRegistry: React.FC<ApicurioRegistryProps> = ({ render, breadcrumbId }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const { tenantId } = useParams<{ tenantId: string }>();
  const { showModal } = useRootModalContext();
  const { renderDownloadArtifacts } = useSharedContext() || {};

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [registry, setRegistry] = useState<Registry | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRegistry = async () => {
    const accessToken = await auth?.srs.getToken();
    setLoading(true);
    const api = new RegistriesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    if (accessToken && tenantId) {
      await api
        .getRegistry(tenantId)
        .then((res) => {
          setRegistry(res?.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          //todo: handle error
        });
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  const onConnectToRegistry = () => {
    setIsExpandedDrawer(true);
  };

  const onCloseDrawer = () => {
    setIsExpandedDrawer(false);
  };

  const onDeleteRegistry = (registry: Registry | undefined) => {
    const { status } = registry || {};
    showModal(MODAL_TYPES.DELETE_SERVICE_REGISTRY, {
      shouldRedirect: true,
      serviceRegistryStatus: status,
      selectedItemData: registry,
      title: `${t('common.delete_service_registry_title')}?`,
      confirmButtonProps: {
        label: t('common.delete'),
      },
      renderDownloadArtifacts
    });
  };

  if (loading) {
    return (
      <PageSection variant={PageSectionVariants.light} padding={{ default: 'noPadding' }}>
        <MASLoading />
      </PageSection>
    );
  }

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
