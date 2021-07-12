import React from 'react';
import {
  TextContent,
  Text,
  TextVariants,
  ClipboardCopy,
  Form,
  FormGroup,
  Title,
  TitleSizes,
  Skeleton,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

type ConnectionInfoProps = {
  registryApisUrl: string;
};

export const ConnectionInfo: React.FC<ConnectionInfoProps> = ({ registryApisUrl }) => {
  const { t } = useTranslation();

  const registriesInfo = [
    { title: t('srs.connection_content_1'), code: `${registryApisUrl}/apis/registry/v2` },
    { title: t('srs.connection_content_2'), code: `${registryApisUrl}/apis/ccompat/v6` },
    { title: t('srs.connection_content_3'), code: `${registryApisUrl}/apis/cncf/v0` },
  ];

  return (
    <div className="mas--details__drawer--tab-content">
      <TextContent className="pf-u-pb-sm">
        <Title headingLevel={'h2'} size={TitleSizes['lg']}>
          {t('common.connection')}
        </Title>
      </TextContent>

      <TextContent className="pf-u-pb-sm">
        <Text component={TextVariants.small}>{t('srs.connection_title_info')}</Text>
      </TextContent>
      <Form>
        {registriesInfo?.map(({ title, code }, index) =>
          registryApisUrl ? (
            <FormGroup label={title} fieldId={`copy-clipboard-${index}`} key={`${code}'-'${index}`}>
              <ClipboardCopy
                id={`copy-clipboard-${index}`}
                hoverTip={t('common.copy_clipboard')}
                clickTip={t('common.copy_clipboard_successfully')}
                textAriaLabel={title}
                isReadOnly
              >
                {code}
              </ClipboardCopy>
            </FormGroup>
          ) : (
            <Skeleton fontSize="2xl" />
          )
        )}
      </Form>
    </div>
  );
};
