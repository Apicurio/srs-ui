import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Level,
  LevelItem,
  TextContent,
  Text,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';

export type ServiceRegistryHeaderProps = {
  onConnectToRegistry?: () => void;
  onDeleteRegistry?: () => void;
  showBreadcrumb?: boolean;
  activeBreadcrumbItemLabel?: string;
  navPrefixPath?: string;
  showKebab?: boolean;
  federatedModule?: string;
};

export enum FederatedModuleActions {
  Artifacts = 'artifacts',
  ArtifactsDetails = 'artifacts-details',
  Rules = 'rules',
  ArtifactRedirect = 'artifact-redirect',
}

export const ServiceRegistryHeader: React.FC<ServiceRegistryHeaderProps> = ({
  onConnectToRegistry,
  onDeleteRegistry,
  activeBreadcrumbItemLabel,
  navPrefixPath,
  showKebab = true,
  federatedModule,
}: ServiceRegistryHeaderProps) => {
  const { t } = useTranslation();
  let showBreadcrumb = false;
  const [isOpen, setIsOpen] = useState<boolean>();

  if (federatedModule === FederatedModuleActions.ArtifactsDetails) {
    showBreadcrumb = true;
    activeBreadcrumbItemLabel = t('srs.artifacts_details');
  } else if (federatedModule === FederatedModuleActions.Rules) {
    showBreadcrumb = true;
    activeBreadcrumbItemLabel =t('srs.global_rules');
  }

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const dropdownItems = [
    <DropdownItem key="connect-registry" onClick={onConnectToRegistry}>
      {t('srs.connect_to_registry')}
    </DropdownItem>,
    <DropdownItem key="delete-registry" onClick={onDeleteRegistry}>
      {t('srs.delete_registry')}
    </DropdownItem>,
  ];

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Level>
        <LevelItem>
          {showBreadcrumb ? (
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to={navPrefixPath || '/'}> {t('srs.service_registry')}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive={true}>{activeBreadcrumbItemLabel}</BreadcrumbItem>
            </Breadcrumb>
          ) : (
            <TextContent>
              <Text component="h1"> {t('srs.service_registry')}</Text>
            </TextContent>
          )}
        </LevelItem>
        {showKebab && (
          <LevelItem>
            <Dropdown
              onSelect={onSelect}
              toggle={<KebabToggle onToggle={onToggle} id="toggle-service-registry" />}
              isOpen={isOpen}
              isPlain
              dropdownItems={dropdownItems}
              position={DropdownPosition.right}
            />
          </LevelItem>
        )}
      </Level>
    </PageSection>
  );
};
