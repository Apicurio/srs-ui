import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, ButtonVariant } from '@patternfly/react-core';
import { MASEmptyState, MASEmptyStateVariant } from '@app/components';
import { ServiceRegistryHeader } from '@app/ServiceRegistry/components';

export type UnauthrizedUserProps = {
  getAccessToServiceRegistry: () => void;
};

const UnauthrizedUser: FC<UnauthrizedUserProps> = ({
  getAccessToServiceRegistry,
}) => {
  const { t } = useTranslation('service-registry');

  return (
    <>
      <ServiceRegistryHeader />
      <PageSection padding={{ default: 'noPadding' }} isFilled>
        <MASEmptyState
          emptyStateProps={{ variant: MASEmptyStateVariant.NoAccess }}
          titleProps={{ title: t('unauthorized_empty_state_title') }}
          emptyStateBodyProps={{
            body: t('unauthorized_empty_state_body'),
          }}
          buttonProps={{
            title: t('get_access_to_service_registry'),
            variant: ButtonVariant.primary,
            onClick: getAccessToServiceRegistry,
          }}
        />
      </PageSection>
    </>
  );
};

export { UnauthrizedUser };
