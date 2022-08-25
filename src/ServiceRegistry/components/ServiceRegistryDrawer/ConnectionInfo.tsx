import { FC } from 'react';
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
import { Trans, useTranslation } from 'react-i18next';
import { HelpIcon } from '@patternfly/react-icons';
import { useSharedContext } from '@app/context';
import { Registry } from '@rhoas/registry-management-sdk';
import { Link } from 'react-router-dom';
import {
  useBasename,
  useModal,
  ModalType,
} from '@rhoas/app-services-ui-shared';

type ConnectionInfoProps = {
  registryApisUrl: string | undefined;
  registryInstance: Registry | undefined;
};

export const ConnectionInfo: FC<ConnectionInfoProps> = ({
  registryApisUrl,
  registryInstance,
}) => {
  const { tokenEndPointUrl } = useSharedContext() || {};
  const { t } = useTranslation(['service-registry']);
  const { getBasename } = useBasename() || {};
  const basename = getBasename && getBasename();
  const { showModal } = useModal<ModalType.KasCreateServiceAccount>();

  const registriesInfo = [
    {
      title: t('connection_content_1'),
      code: `${registryApisUrl}/apis/registry/v2`,
    },
    {
      title: t('connection_content_2'),
      code: `${registryApisUrl}/apis/ccompat/v6`,
    },
    {
      title: t('connection_content_3'),
      code: `${registryApisUrl}/apis/cncf/v0`,
    },
  ];

  const handleCreateServiceAccountModal = () => {
    showModal(ModalType.KasCreateServiceAccount, {});
  };

  return (
    <div className='mas--details__drawer--tab-content'>
      <TextContent className='pf-u-pb-sm'>
        <Title headingLevel={'h2'} size={TitleSizes['lg']}>
          {t('common:connection')}
        </Title>
      </TextContent>

      <TextContent className='pf-u-pb-sm'>
        <Text component={TextVariants.small}>{t('connection_title_info')}</Text>
      </TextContent>
      <Form>
        {registriesInfo?.map(({ title, code }, index) =>
          registryApisUrl ? (
            <FormGroup
              label={title}
              fieldId={`copy-clipboard-${index}`}
              key={`${code}'-'${index}`}
            >
              <ClipboardCopy
                id={`copy-clipboard-${index}`}
                hoverTip={t('common:copy_clipboard')}
                clickTip={t('common:copy_clipboard_successfully')}
                textAriaLabel={title}
                isReadOnly
              >
                {code}
              </ClipboardCopy>
            </FormGroup>
          ) : (
            <Skeleton fontSize='2xl' />
          )
        )}
      </Form>
      <TextContent className='pf-u-pb-sm'>
        <Text component={TextVariants.h3} className='pf-u-mt-xl'>
          {t('service_accounts_small')}
        </Text>
        <Text component={TextVariants.small}>
          {t('create_service_account_to_generate_credentials')}{' '}
          <Link to={'/service-accounts'} data-testid='tableStreams-linkKafka'>
            {t('service_accounts')}
          </Link>{' '}
          {t('common:page')}.
        </Text>
      </TextContent>
      <Button
        variant='secondary'
        onClick={handleCreateServiceAccountModal}
        data-testid='drawerStreams-buttonCreateServiceAccount'
        isInline
      >
        {t('create_service_account')}
      </Button>
      <TextContent className='pf-u-pt-sm'>
        <Text component={TextVariants.small}>
          <Trans
            ns='service-registry'
            i18nKey='current_instance'
            components={[
              <Link
                to={`${basename}/t/${registryInstance?.id}/roles`}
                key='tableRegistries-linkKafka'
              ></Link>,
            ]}
          />
        </Text>
      </TextContent>
      <TextContent className='pf-u-pb-sm'>
        <Text component={TextVariants.h3} className='pf-u-mt-xl'>
          {t('authentication_method')}
        </Text>
        <Text component={TextVariants.h4} className='pf-u-mt-md'>
          {t('oauth')} <Label color='green'>{t('recommended')}</Label>
          <Popover
            aria-label={t('oauth')}
            bodyContent={<div>{t('oauth_popover_content')}</div>}
          >
            <Button
              variant={ButtonVariant.plain}
              aria-label={t('more_info_about_oauth')}
            >
              <HelpIcon />
            </Button>
          </Popover>
        </Text>
        <Text component={TextVariants.small}>{t('oauth_description')}</Text>
        <Text component={TextVariants.h6} className='pf-u-mt-md'>
          {t('token_endpoint_url')}
        </Text>
        <ClipboardCopy isReadOnly>{tokenEndPointUrl}</ClipboardCopy>
      </TextContent>
      <TextContent className='pf-u-pb-sm'>
        <Text component={TextVariants.h4} className='pf-u-mt-md'>
          {t('http_basic')}
        </Text>
        <Text component={TextVariants.small}>
          {t('http_basic_description')}
        </Text>
      </TextContent>
    </div>
  );
};
