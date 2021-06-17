import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, ButtonVariant } from '@patternfly/react-core';
import { MASEmptyState, MASEmptyStateVariant } from '@app/components';

export type WelcomeEmptyStateProps = {
  createServiceRegistry: () => void;
  isLoading: boolean;
};

const WelcomeEmptyState: React.FC<WelcomeEmptyStateProps> = ({ createServiceRegistry, isLoading }) => {
  const { t } = useTranslation();

  return (
    <PageSection padding={{ default: 'noPadding' }} isFilled>
      <MASEmptyState
        emptyStateProps={{ variant: MASEmptyStateVariant.GettingStarted }}
        titleProps={{ title: t('srs.welcome_to_service_registry') }}
        emptyStateBodyProps={{
          body: t('srs.welcome_empty_state_body'),
        }}
        buttonProps={{
          title: t('srs.create_service_registry'),
          variant: ButtonVariant.primary,
          onClick: createServiceRegistry,
          isLoading: isLoading,
          spinnerAriaValueText: isLoading ? t('common.loading') : undefined,
        }}
      />
    </PageSection>
  );
};

export { WelcomeEmptyState };
