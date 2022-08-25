import { FC } from 'react';
import {
  EmptyState as PFEmptyState,
  EmptyStateSecondaryActions,
  Bullseye,
  Spinner,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { css } from '@patternfly/react-styles';

export const Loading: FC = () => {
  const { t } = useTranslation("service-registry");

  return (
    <PFEmptyState className={css('pf-u-pt-2xl pf-u-pt-3xl-on-md')}>
      <EmptyStateSecondaryActions>
        <Bullseye>
          <Spinner size='xl' />
        </Bullseye>
      </EmptyStateSecondaryActions>
      <EmptyStateSecondaryActions>
        <TextContent>
          <Text component={TextVariants.h1}>{t('schema_loading')}</Text>
        </TextContent>
      </EmptyStateSecondaryActions>
    </PFEmptyState>
  );
};
