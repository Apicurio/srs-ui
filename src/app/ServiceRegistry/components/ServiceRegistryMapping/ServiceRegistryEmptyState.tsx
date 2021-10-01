import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    EmptyState as PFEmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateSecondaryActions,
    ClipboardCopy,
    Button,
    Title,
} from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons/dist/js/icons/wrench-icon';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/js/icons/arrow-right-icon'
import { useHistory } from 'react-router-dom';
import { useBasename } from '@rhoas/app-services-ui-shared';
import { css } from '@patternfly/react-styles';

export type EmptyStateProps = {
    topicName: string
};

export const ServiceRegistryMappingEmptyState: React.FC<EmptyStateProps> = ({
    topicName
}: EmptyStateProps) => {
    const { t } = useTranslation();

    const histroy = useHistory();

    const { getBasename } = useBasename() || { getBasename: () => '' };
    const basename = getBasename();

    const onClickLink = () => {
        histroy.push(`${basename}`);

    }

    return (
        <PFEmptyState
            className={css('pf-u-pt-2xl pf-u-pt-3xl-on-md')}>
            <EmptyStateIcon icon={WrenchIcon} />
            <Title headingLevel='h2' size="lg">
                {t('srs.empty_state_title')}
            </Title>
            <EmptyStateBody>
                {t('srs.empty_state_body')}
            </EmptyStateBody>
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
                <Button variant='link' onClick={onClickLink}>
                    {t('srs.go_to_service_registry_instance_helper_text')} <ArrowRightIcon />
                </Button>
            </EmptyStateSecondaryActions>
        </PFEmptyState>
    );
};