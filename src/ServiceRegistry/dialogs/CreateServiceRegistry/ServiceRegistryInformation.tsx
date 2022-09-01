import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextContent,
  Text,
  TextVariants,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Grid,
  GridItem,
  Button,
  ButtonVariant,
} from '@patternfly/react-core';
import {
  QuickStartContext,
  QuickStartContextValues,
} from '@patternfly/quickstarts';

export type ServiceRegistryInformationProps = {
  isSrsTrial?: boolean;
};

const ServiceRegistryInformation: FC<ServiceRegistryInformationProps> = ({
  isSrsTrial,
}) => {
  const { t } = useTranslation('service-registry');

  const qsContext: QuickStartContextValues = useContext(QuickStartContext);

  return (
    <TextContent>
      <Text component={TextVariants.h3}>
        {t('common:instance_information')}
      </Text>
      <TextList component={TextListVariants.dl}>
        <Grid sm={6} lg={12} hasGutter>
          {isSrsTrial && (
            <GridItem>
              <TextListItem component={TextListItemVariants.dt}>
                {t('common:duration')}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {t('common:duration_value')}
              </TextListItem>
            </GridItem>
          )}
          <GridItem>
            <TextListItem component={TextListItemVariants.dt}>
              {t('artifact_versions')}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {t('artifact_versions_value')}
            </TextListItem>
          </GridItem>
          <GridItem>
            <TextListItem component={TextListItemVariants.dt}>
              {t('artifact_size')}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {t('artifact_size_value')}
            </TextListItem>
          </GridItem>
          <GridItem>
            <TextListItem component={TextListItemVariants.dt}>
              {t('request_rate')}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {t('request_rate_value')}
            </TextListItem>
          </GridItem>
        </Grid>
        <Button
          isSmall
          isInline
          variant={ButtonVariant.link}
          style={{ marginTop: '20px' }}
          onClick={() =>
            qsContext.setActiveQuickStart &&
            qsContext.setActiveQuickStart('getting-started-service-registry')
          }
        >
          {t('common:quick_start_guide_message')}
        </Button>
      </TextList>
    </TextContent>
  );
};

export { ServiceRegistryInformation };
