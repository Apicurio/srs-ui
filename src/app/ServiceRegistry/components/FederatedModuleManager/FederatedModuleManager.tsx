import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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

export type FederatedModuleManagerProps = ServiceRegistryHeaderProps & {
  tenantId?: string;
  navPrefixPath?: string;
  baseUIPath?: string;
  params?: ServiceRegistryParams;
};

export type ServiceRegistryParams = {
  tenantId: string;
  groupId: string;
  artifactId: string;
  version: string;
};

const FederatedModuleManager: React.FC<FederatedModuleManagerProps> = ({
  tenantId,
  navPrefixPath,
  baseUIPath = '',
  params,
  onConnectToRegistry,
  onDeleteRegistry,
  homeLinkPath,
}) => {
  const history = useHistory();
  const location = useLocation();
  const { groupId, artifactId, version } = params || {};

  if (baseUIPath) {
    navPrefixPath = `${baseUIPath}/t/${tenantId}`;
  } else {
    navPrefixPath ||= `/t/${tenantId}`;
  }

  const renderFederateComponent = () => {
    let pathname = location?.pathname;
    let federatedComponent;
    let showBreadcrumb: boolean = false;
    let activeBreadcrumbItemLabel: string = '';

    if (pathname?.endsWith('/')) {
      pathname = pathname.substring(0, pathname?.length - 1);
    }
    pathname = pathname?.replace(baseUIPath, '');

    if (!pathname || pathname === `/t/${tenantId}/artifacts`) {
      federatedComponent = (
        <FederatedArtifactsPage tenantId={tenantId} navPrefixPath={navPrefixPath} history={history} />
      );
    } else if (pathname === `/t/${tenantId}/rules`) {
      showBreadcrumb = true;
      activeBreadcrumbItemLabel = 'Global Rules';
      federatedComponent = <FederatedRulesPage tenantId={tenantId} navPrefixPath={navPrefixPath} history={history} />;
    } else if (groupId && artifactId && version) {
      showBreadcrumb = true;
      activeBreadcrumbItemLabel = 'Artifacts Details';
      federatedComponent = (
        <FederatedArtifactVersionPage
          tenantId={tenantId}
          navPrefixPath={navPrefixPath}
          history={history}
          groupId={groupId}
          artifactId={artifactId}
          version={version}
        />
      );
    } else if (groupId && artifactId) {
      federatedComponent = (
        <FederatedArtifactRedirectPage
          tenantId={tenantId}
          navPrefixPath={navPrefixPath}
          history={history}
          groupId={groupId}
          artifactId={artifactId}
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
