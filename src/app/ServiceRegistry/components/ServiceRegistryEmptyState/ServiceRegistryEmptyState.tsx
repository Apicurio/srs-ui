import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, ButtonVariant } from '@patternfly/react-core';
import { MASEmptyState, MASEmptyStateVariant } from '@app/components';

export type ServiceRegistryEmptyStateProps = {
  onCreateserviceRegistry: () => void;
};

const ServiceRegistryEmptyState: React.FC<ServiceRegistryEmptyStateProps> = ({ onCreateserviceRegistry }) => {
  const { t } = useTranslation();

  return (
    <PageSection padding={{ default: 'noPadding' }} isFilled>
      <MASEmptyState
        emptyStateProps={{ variant: MASEmptyStateVariant.NoItems }}
        titleProps={{ title: t('srs.empty_state_registry_title') }}
        emptyStateBodyProps={{
          body: t('srs.empty_state_registry_description'),
        }}
        buttonProps={{
          title: t('srs.create_service_registry'),
          variant: ButtonVariant.primary,
          onClick: onCreateserviceRegistry,
        }}
      />
    </PageSection>
  );
};

export { ServiceRegistryEmptyState };
