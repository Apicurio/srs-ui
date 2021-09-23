import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    PageSection,
    EmptyState as PFEmptyState,
    EmptyStateVariant,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateProps as PFEmptyStateProps,
    EmptyStateSecondaryActions,
    ClipboardCopy,
    EmptyStateBodyProps,
    Button,
    Title,
} from '@patternfly/react-core';

import { WrenchIcon } from '@patternfly/react-icons/dist/js/icons/wrench-icon';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/js/icons/arrow-right-icon'
import { useHistory } from 'react-router-dom';
import { useBasename } from '@bf2/ui-shared';

export const ServiceRegistryMappingEmptyState: React.FC = () => {
    const { t } = useTranslation();

    const histroy = useHistory();

    const { getBasename } = useBasename() || { getBasename: () => '' };
    const basename = getBasename();

    const onClickLink = () => {
        histroy.push(`${basename}`);

    }

    return (
        <PageSection>
            <PFEmptyState>
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
                        {t('srs.topic_test_value')}
                    </ClipboardCopy>
                </EmptyStateSecondaryActions>
                <EmptyStateSecondaryActions>
                    <ClipboardCopy
                        isReadOnly
                        hoverTip='Copy'
                        clickTip='Copied'
                        className='pf-u-w-25'
                    >
                        {t('srs.topic_test_key')}
                    </ClipboardCopy>
                </EmptyStateSecondaryActions>
                <EmptyStateSecondaryActions>
                    <Button variant='link' onClick={onClickLink}>
                        Go to Service Registry instance <ArrowRightIcon />
                    </Button>
                </EmptyStateSecondaryActions>
            </PFEmptyState>

        </PageSection>

    );
}