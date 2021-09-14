import React from 'react';
import { Alert, AlertVariant, Spinner } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { Quota, QuotaType, QuotaValue } from '@rhoas/app-services-ui-shared';

export type QuotaAlertProps = {
  quota: Quota | undefined;
  hasServiceRegistryCreationFailed?: boolean;
  loadingQuota: boolean;
  hasUserTrialInstance?: boolean;
};

export const QuotaAlert: React.FC<QuotaAlertProps> = ({
  quota,
  hasServiceRegistryCreationFailed,
  loadingQuota,
  hasUserTrialInstance,
}) => {
  const { t } = useTranslation();
  const { data, isServiceDown } = quota || {};
  const srsQuota: QuotaValue | undefined = data?.get(QuotaType?.srs);
  const srsTrial: QuotaValue | undefined = data?.get(QuotaType?.srsTrial);

  let titleKey = '';
  let messageKey = '';
  let variant: AlertVariant = AlertVariant.warning;

  //trial quota flows
  //if user has no standard quota and already has a trial instance
  if (!srsQuota && srsTrial && hasUserTrialInstance) {
    titleKey = 'common.trial_service_registry_title';
    variant = AlertVariant.warning;
    messageKey = 'common.deploy_one_instance_alert_message';
  }
  //if user has no standard quota and no trial quota
  else if (!srsQuota && !srsTrial && !loadingQuota) {
    variant = AlertVariant.warning;
    titleKey = 'common.no_quota_service_registry_alert_title';
    messageKey = 'common.no_quota_service_registry_alert_message';
  }
  //if user has no standard quota and trial instances are available
  else if (!srsQuota && srsTrial && !hasUserTrialInstance) {
    variant = AlertVariant.info;
    titleKey = 'common.trial_quota_service_registry_title';
  }
  //standard quota flows
  //if user has standard quota but all allowed instances are already provisioned
  else if (srsQuota && srsQuota?.remaining === 0) {
    variant = AlertVariant.warning;
    titleKey = 'common.standard_service_registry_alert_title';
    messageKey = 'common.standard_service_registry_alert_message';
  }
  //if user has standard quota and 1 or more allowed instances are available
  else if (srsQuota && srsQuota?.remaining > 0) {
    //don't show alert
    titleKey = '';
  }
  //if kafka creation failed for quota related
  if (hasServiceRegistryCreationFailed) {
    variant = AlertVariant.danger;
    titleKey = 'common.service_registry_creation_failed_alert_title';
    messageKey = srsQuota
      ? 'common.standard_service_registry_creation_failed_alert_message'
      : 'common.trial_service_registry_creation_failed_alert_message';
  }
  //if service down or any error
  if (isServiceDown) {
    titleKey = 'common.something_went_wrong';
    variant = AlertVariant.danger;
    messageKey = 'common.ams_service_down_message';
  }

  return (
    <>
      {loadingQuota && (
        <Alert
          className="pf-u-mb-md"
          variant={AlertVariant.info}
          title={t('common.instance_checking_message')}
          aria-live="polite"
          isInline
          customIcon={<Spinner size="md" aria-valuetext="Checking service registry availability" />}
        />
      )}

      {titleKey && (
        <Alert className="pf-u-mb-md" variant={variant} title={t(titleKey)} aria-live="polite" isInline>
          {t(messageKey)}
        </Alert>
      )}
    </>
  );
};
