import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, ButtonVariant } from '@patternfly/react-core';
import { MASEmptyState, MASEmptyStateVariant } from '@app/components';
import { ServiceRegistryHeader } from '@app/ServiceRegistry/components';

export type UnauthrizedUserProps = {
  getAccessToServiceRegistry: () => void;
};

const UnauthrizedUser: React.FC<UnauthrizedUserProps> = ({ getAccessToServiceRegistry }) => {
  const { t } = useTranslation();

  return (
    <>
      <ServiceRegistryHeader showKebab={false} />
      <PageSection padding={{ default: 'noPadding' }} isFilled>
        <MASEmptyState
          emptyStateProps={{ variant: MASEmptyStateVariant.NoAccess }}
          titleProps={{ title: t('serviceRegistry.unauthorized_empty_state_title') }}
          emptyStateBodyProps={{
            body: t('serviceRegistry.unauthorized_empty_state_body'),
          }}
          buttonProps={{
            title: t('serviceRegistry.get_access_to_service_registry'),
            variant: ButtonVariant.primary,
            onClick: getAccessToServiceRegistry,
          }}
        />
      </PageSection>
    </>
  );
};

export { UnauthrizedUser };
