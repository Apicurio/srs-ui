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
  Label,
  Popover,
  Button,
  ButtonVariant,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { HelpIcon } from '@patternfly/react-icons';

type ConnectionInfoProps = {
  registryApisUrl: string;
  tokenEndPointUrl: string;
};

export const ConnectionInfo: React.FC<ConnectionInfoProps> = ({ registryApisUrl, tokenEndPointUrl }) => {
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
      <TextContent className='pf-u-pb-sm'>
        <Text component={TextVariants.h3} className='pf-u-mt-xl'>
          {t('srs.authentication_method')}
        </Text>
        <Text component={TextVariants.h4} className='pf-u-mt-md'>
          {t('srs.oauth')}{' '}
          <Label color='green'>{t('srs.recommended')}</Label>
          <Popover
            aria-label={t('srs.oauth')}
            bodyContent={
              <div>{t('srs.oauth_popover_content')}</div>
            }
          >
            <Button
              variant={ButtonVariant.plain}
              aria-label={t('more_info_about_oauth')}
            >
              <HelpIcon />
            </Button>
          </Popover>
        </Text>
      <Text component={TextVariants.small}>
          {t('srs.oauth_description')}
        </Text>
        <Text component={TextVariants.h6} className='pf-u-mt-md'>
          {t('srs.token_endpoint_url')}
        </Text>
          <ClipboardCopy>{tokenEndPointUrl}</ClipboardCopy>
      </TextContent>
      <TextContent className='pf-u-pb-sm'>
        <Text component={TextVariants.h4} className='pf-u-mt-md'>
          {t('srs.http_basic')}
        </Text>
        <Text component={TextVariants.small}>
          {t('srs.http_basic_description')}
        </Text>
      </TextContent>
    </div>
  );
};
