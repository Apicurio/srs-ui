import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, ButtonVariant } from '@patternfly/react-core';
import { MASEmptyState, MASEmptyStateVariant, useRootModalContext, MODAL_TYPES } from '@app/components';

type WelcomeEmptyStateProps = {
  fetchServiceRegistries: () => void;
};

const WelcomeEmptyState: React.FC<WelcomeEmptyStateProps> = ({ fetchServiceRegistries }) => {
  const { t } = useTranslation();
  const { showModal } = useRootModalContext();

  const onCreateserviceRegistry = () => {
    showModal(MODAL_TYPES.CREATE_SERVICE_REGISTRY, {
      fetchServiceRegistries,
    });
  };

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
          onClick: onCreateserviceRegistry,
        }}
      />
    </PageSection>
  );
};

export { WelcomeEmptyState };
