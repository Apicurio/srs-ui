import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  EmptyState as PFEmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  ClipboardCopy,
  Title,
} from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons/dist/js/icons/wrench-icon';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/js/icons/arrow-right-icon';

export type EmptyStateProps = {
  topicName: string;
  basename: string;
};

export const EmptyState: FC<EmptyStateProps> = ({
  topicName,
  basename,
}: EmptyStateProps) => {
  const { t } = useTranslation('service-registry');

  return (
    <PFEmptyState className='pf-u-pt-2xl pf-u-pt-3xl-on-md'>
      <EmptyStateIcon icon={WrenchIcon} />
      <Title headingLevel='h2' size='lg'>
        {t('empty_state_title')}
      </Title>
      <EmptyStateBody>{t('empty_state_body')}</EmptyStateBody>
      <EmptyStateSecondaryActions>
        <ClipboardCopy
          isReadOnly
          hoverTip='Copy'
          clickTip='Copied'
          className='pf-u-w-25'
        >
          {topicName + '-value'}
        </ClipboardCopy>
      </EmptyStateSecondaryActions>
      <EmptyStateSecondaryActions>
        <ClipboardCopy
          isReadOnly
          hoverTip='Copy'
          clickTip='Copied'
          className='pf-u-w-25'
        >
          {topicName + '-key'}
        </ClipboardCopy>
      </EmptyStateSecondaryActions>
      <EmptyStateSecondaryActions>
        <Link to={basename}>
          {t('go_to_service_registry_instance_helper_text')} <ArrowRightIcon />
        </Link>
      </EmptyStateSecondaryActions>
    </PFEmptyState>
  );
};
