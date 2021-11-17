import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { PageSection, ButtonVariant, Button } from '@patternfly/react-core';
import { MASEmptyState, MASEmptyStateVariant } from '@app/components';
import {
  QuickStartContext,
  QuickStartContextValues,
} from '@patternfly/quickstarts';

export type ServiceRegistryEmptyStateProps = {
  onCreateserviceRegistry: () => void;
};

const ServiceRegistryEmptyState: React.FC<ServiceRegistryEmptyStateProps> = ({ onCreateserviceRegistry }) => {
  const { t } = useTranslation();

  const qsContext: QuickStartContextValues =
    React.useContext(QuickStartContext);

  return (
    <PageSection padding={{ default: 'noPadding' }} isFilled>
      <MASEmptyState
        emptyStateProps={{ variant: MASEmptyStateVariant.NoItems }}
        titleProps={{ title: t('srs.empty_state_registry_title') }}
        emptyStateBodyProps={{
          body: (
            <>
              <Trans
                i18nKey='srs.empty_state_registry_description'
                components={[
                  <Button
                    variant={ButtonVariant.link}
                    isSmall
                    isInline
                    key='btn-quick-start'
                    onClick={() =>
                      qsContext.setActiveQuickStart &&
                      qsContext.setActiveQuickStart('getting-started-service-registry')
                    }
                  />,
                ]}
              />
            </>
          ),
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
