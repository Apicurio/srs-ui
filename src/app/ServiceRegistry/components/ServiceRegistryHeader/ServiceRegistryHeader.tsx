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
import {useBasename} from "@bf2/ui-shared";

export type ServiceRegistryHeaderProps = {
  onConnectToRegistry?: () => void;
  onDeleteRegistry?: () => void;
  breadcrumbId?: string;
  showKebab?: boolean;
};

export const ServiceRegistryHeader: React.FC<ServiceRegistryHeaderProps> = ({
  onConnectToRegistry,
  onDeleteRegistry,
  breadcrumbId,
  showKebab = true,
}: ServiceRegistryHeaderProps) => {
  const { t } = useTranslation();
  let showBreadcrumb = false;
  let activeBreadcrumbItemLabel = "";
  const [isOpen, setIsOpen] = useState<boolean>();
  const basename = useBasename();

  if (breadcrumbId != undefined) {
    showBreadcrumb = true;
    //activeBreadcrumbItemLabel = t('srs.artifacts_details');
    activeBreadcrumbItemLabel = t(breadcrumbId);
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
                <Link to={basename.getBasename() || '/'}> {t('srs.service_registry')}</Link>
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
