import React from 'react';
import { useHistory } from 'react-router-dom';
// @ts-ignore
const FederatedArtifactsPage = React.lazy(() => import('@apicurio/registry/FederatedArtifactsPage'));
// @ts-ignore
const FederatedRulesPage = React.lazy(() => import('@apicurio/registry/FederatedRulesPage'));
// @ts-ignore
const FederatedArtifactVersionPage = React.lazy(() => import('@apicurio/registry/FederatedArtifactVersionPage'));
// @ts-ignore
const FederatedArtifactRedirectPage = React.lazy(() => import('@apicurio/registry/FederatedArtifactRedirectPage'));
import { MASLoading } from '@app/components';
import { ServiceRegistryHeader, ServiceRegistryHeaderProps } from '@app/ServiceRegistry/components';
import { ConfigType } from './config.types';

export type FederatedModuleManagerProps = ServiceRegistryHeaderProps & {
  tenantId?: string;
  navPrefixPath?: string;
  baseUIPath?: string;
  params?: ServiceRegistryParams;
  activeFederatedModule?: string;
};

function federatedConfig(tenantId: string, navPrefixPath: string) {
  const config: any = {
    auth: {
      options: {},
      type: 'none',
    },
    tenants: {
      api: 'http://tenant-manager-mt-apicurio-apicurio-registry.apps.zero.massopen.cloud/api/v1',
    },
    registry: {
      apis: `https://apicurio-registry-mt-apicurio-apicurio-registry.apps.zero.massopen.cloud/t/${tenantId}/apis`,
      config: {
        artifacts: {
          url: `https://apicurio-registry-mt-apicurio-apicurio-registry.apps.zero.massopen.cloud/t/${tenantId}/apis`,
        },
        auth: {
          type: 'none',
        },
        features: {
          readOnly: false,
          breadcrumbs: false,
          multiTenant: false,
        },
        ui: {
          navPrefixPath,
        },
      },
    },
  };

  return config;
}

export type ServiceRegistryParams = {
  tenantId: string;
  groupId: string;
  artifactId: string;
  version: string;
};

export enum FederatedModule {
  Artifacts = 'artifacts',
  ArtifactsDetails = 'artifacts-details',
  Rules = 'rules',
  ArtifactRedirect = 'artifact-redirect',
}

const FederatedModuleManager: React.FC<FederatedModuleManagerProps> = ({
  tenantId = '',
  navPrefixPath = '',
  baseUIPath = '',
  params,
  onConnectToRegistry,
  onDeleteRegistry,
  homeLinkPath,
  activeFederatedModule,
}) => {
  const history = useHistory();
  const { groupId, artifactId, version } = params || {};
  if (baseUIPath) {
    navPrefixPath = `${baseUIPath}/t/${tenantId}`;
  } else {
    navPrefixPath ||= `/t/${tenantId}`;
  }
  const config = federatedConfig(tenantId, navPrefixPath);

  const renderFederateComponent = () => {
    let federatedComponent;
    let showBreadcrumb: boolean = false;
    let activeBreadcrumbItemLabel: string = '';

    if (activeFederatedModule === FederatedModule.Artifacts) {
      federatedComponent = <FederatedArtifactsPage config={config} history={history} />;
    } else if (activeFederatedModule === FederatedModule.Rules) {
      showBreadcrumb = true;
      activeBreadcrumbItemLabel = 'Global Rules';
      federatedComponent = <FederatedRulesPage config={config} history={history} />;
    } else if (activeFederatedModule === FederatedModule.ArtifactRedirect) {
      federatedComponent = (
        <FederatedArtifactRedirectPage config={config} history={history} groupId={groupId} artifactId={artifactId} />
      );
    } else if (activeFederatedModule === FederatedModule.ArtifactsDetails) {
      showBreadcrumb = true;
      activeBreadcrumbItemLabel = 'Artifacts Details';
      federatedComponent = (
        <FederatedArtifactVersionPage
          config={config}
          history={history}
          groupId={groupId}
          artifactId={artifactId}
          version={version}
        />
      );
    }

    return (
      <>
        <ServiceRegistryHeader
          onConnectToRegistry={onConnectToRegistry}
          onDeleteRegistry={onDeleteRegistry}
          showBreadcrumb={showBreadcrumb}
          activeBreadcrumbItemLabel={activeBreadcrumbItemLabel}
          homeLinkPath={homeLinkPath}
        />
        {federatedComponent}
      </>
    );
  };

  return <React.Suspense fallback={<MASLoading />}>{renderFederateComponent()}</React.Suspense>;
};

export { FederatedModuleManager };
