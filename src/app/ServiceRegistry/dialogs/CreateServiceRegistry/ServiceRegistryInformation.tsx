import React from 'react';
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
} from '@patternfly/react-core';

export type ServiceRegistryInformationProps = {
  isSrsTrial?: boolean;
};

const ServiceRegistryInformation: React.FC<ServiceRegistryInformationProps> = ({ isSrsTrial }) => {
  const { t } = useTranslation();

  return (
    <TextContent>
      <Text component={TextVariants.h3}>{t('common.instance_information')}</Text>
      <TextList component={TextListVariants.dl}>
        <Grid sm={6} lg={12} hasGutter>
          {isSrsTrial && (
            <GridItem>
              <TextListItem component={TextListItemVariants.dt}>{t('common.duration')}</TextListItem>
              <TextListItem component={TextListItemVariants.dd}>{t('common.duration_value')}</TextListItem>
            </GridItem>
          )}
          <GridItem>
            <TextListItem component={TextListItemVariants.dt}>{t('common.artifact_versions')}</TextListItem>
            <TextListItem component={TextListItemVariants.dd}>{t('common.artifact_versions_value')}</TextListItem>
          </GridItem>
          <GridItem>
            <TextListItem component={TextListItemVariants.dt}>{t('common.artifact_size')}</TextListItem>
            <TextListItem component={TextListItemVariants.dd}>{t('common.artifact_size_value')}</TextListItem>
          </GridItem>
          <GridItem>
            <TextListItem component={TextListItemVariants.dt}>{t('common.request_rate')}</TextListItem>
            <TextListItem component={TextListItemVariants.dd}>{t('common.request_rate_value')}</TextListItem>
          </GridItem>
        </Grid>
      </TextList>
    </TextContent>
  );
};

export { ServiceRegistryInformation };
