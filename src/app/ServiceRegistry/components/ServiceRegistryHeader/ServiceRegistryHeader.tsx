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
  homeLinkPath?: string;
  showKebab?: boolean;
};

export const ServiceRegistryHeader: React.FC<ServiceRegistryHeaderProps> = ({
  onConnectToRegistry,
  onDeleteRegistry,
  showBreadcrumb = false,
  activeBreadcrumbItemLabel,
  homeLinkPath,
  showKebab = true,
}: ServiceRegistryHeaderProps) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>();

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const dropdownItems = [
    <DropdownItem key="connect-registry" onClick={onConnectToRegistry}>
      {t('serviceRegistry.connect_to_registry')}
    </DropdownItem>,
    <DropdownItem key="delete-registry" onClick={onDeleteRegistry}>
      {t('serviceRegistry.delete_registry')}
    </DropdownItem>,
  ];

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Level>
        <LevelItem>
          {showBreadcrumb ? (
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to={homeLinkPath || '/'}> {t('serviceRegistry.service_registry')}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive={true}>{activeBreadcrumbItemLabel}</BreadcrumbItem>
            </Breadcrumb>
          ) : (
            <TextContent>
              <Text component="h1"> {t('serviceRegistry.service_registry')}</Text>
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
