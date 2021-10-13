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
import { Registry } from '@rhoas/registry-management-sdk';
import { useBasename } from '@rhoas/app-services-ui-shared';

export type ServiceRegistryHeaderProps = {
  onConnectToRegistry?: (instance: Registry | undefined) => void;
  onDeleteRegistry?: (instance: Registry | undefined) => void;
  breadcrumbId?: string;
  serviceRegistryDetails?: Registry;
};

export const ServiceRegistryHeader: React.FC<ServiceRegistryHeaderProps> = ({
  onConnectToRegistry,
  onDeleteRegistry,
  breadcrumbId,
  serviceRegistryDetails,
}: ServiceRegistryHeaderProps) => {
  const { t } = useTranslation();
  let showBreadcrumb = false;
  let activeBreadcrumbItemLabel = '';
  const [isOpen, setIsOpen] = useState<boolean>();
  const basename = useBasename();

  if (breadcrumbId != undefined) {
    showBreadcrumb = true;
    activeBreadcrumbItemLabel = t(breadcrumbId);
  }

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const dropdownItems = [
    <DropdownItem
      key="connect-registry"
      onClick={() => onConnectToRegistry && onConnectToRegistry(serviceRegistryDetails)}
    >
      {t('srs.view_connection_information')}
    </DropdownItem>,
    <DropdownItem key="delete-registry" onClick={() => onDeleteRegistry && onDeleteRegistry(serviceRegistryDetails)}>
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
                <Link to={basename.getBasename() || '/'}> {t('srs.service_registry_breadcrumb')}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive={true}>{serviceRegistryDetails?.name}</BreadcrumbItem>
            </Breadcrumb>
          ) : (
            <TextContent>
              <Text component="h1"> {t('srs.service_registry')}</Text>
            </TextContent>
          )}
        </LevelItem>
        {breadcrumbId && (
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
