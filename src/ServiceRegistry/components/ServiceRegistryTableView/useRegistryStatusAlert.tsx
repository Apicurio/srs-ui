import { useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlert } from '@rhoas/app-services-ui-shared';
import { AlertVariant } from '@patternfly/react-core';
import { Registry, RegistryStatusValue } from '@rhoas/registry-management-sdk';
import { usePageVisibility, useInterval } from '@app/hooks';

type AlertableInstance = { name: string; status: RegistryStatusValue };

export function useServiceRegistryStatusAlerts(
  instances: Registry[] | undefined
): void {
  const { t } = useTranslation(['service-registry']);
  const { addAlert } = useAlert() || {};
  const { isVisible } = usePageVisibility();
  const previousInstancesRef = useRef<Registry[]>();
  const instancesBeingDeletedRef = useRef<Registry[]>([]);
  const toNotifyRef = useRef<AlertableInstance[]>([]);

  const notifyReady = useCallback(
    (name: string) => {
      addAlert({
        title: t('registry_successfully_created'),
        variant: AlertVariant.success,
        description: (
          <span
            dangerouslySetInnerHTML={{
              __html: t('registry_success_message', { name }),
            }}
          />
        ),
        dataTestId: 'toastCreateRegistry-success',
      });
    },
    [addAlert, t]
  );

  const notifyDelete = useCallback(
    (name: string) => {
      addAlert({
        title: t('service_registry_successfully_deleted', {
          name,
        }),
        variant: AlertVariant.success,
      });
    },
    [addAlert, t]
  );

  const notifyFailure = useCallback(
    (name: string) => {
      addAlert({
        title: t('registry_not_created'),
        variant: AlertVariant.danger,
        description: (
          <span
            dangerouslySetInnerHTML={{
              __html: t('registry_failed_message', { name }),
            }}
          />
        ),
        dataTestId: 'toastCreateRegistry-failed',
      });
    },
    [addAlert, t]
  );

  /**
   * Derive from the updated instances which instances have changed state from
   * the previous run
   */
  useEffect(
    function checkForRegistryStatusValueChange() {
      if (instances) {
        const firstData = previousInstancesRef.current === undefined;
        const previousInstances = previousInstancesRef.current || [];

        const previousIdsAndStates = previousInstances.map(
          (i) => `${i.id}:${i.status}`
        );
        const currentIdsAndStates = instances.map((i) => `${i.id}:${i.status}`);

        // Check for changes between polled data in an unefficent but effective way.
        // We don't stringify the whole Registry object since it's massive and
        // we care only about an instance id and its status.
        if (
          JSON.stringify(previousIdsAndStates) !==
          JSON.stringify(currentIdsAndStates)
        ) {
          // an helper function to get the instances that changed state, but only
          // if we got at least one snapshot of the data. We don't want to notify
          // again for instances already created.
          const filterInstances = (
            instances: Registry[],
            desiredStatus: RegistryStatusValue
          ) => {
            return firstData
              ? []
              : instances.filter(
                  (i) =>
                    i.status === desiredStatus &&
                    !previousInstances.find(
                      (pi) => pi.id === i.id && i.status === desiredStatus
                    )
                );
          };

          // get newly created and failed instances
          const ready = filterInstances(instances, RegistryStatusValue.Ready);
          const failed = filterInstances(instances, RegistryStatusValue.Failed);

          // since it's possible that an instance that is being deleted will
          // simply not be returned the next time we poll for data, we keep track
          // of instances that are deprovisoning in a ref. We check if these
          // instances are still in the current list of instances. If not, they
          // have been deleted and we should notify the user. The others, we keep
          // them in the ref
          const [deleted, stillBeingDeleted] =
            instancesBeingDeletedRef.current.reduce<[Registry[], Registry[]]>(
              ([deleted, beingDeleted], instanceBeingDeleted) => {
                if (
                  instances.find((i) => i.id === instanceBeingDeleted.id) ===
                  undefined
                ) {
                  // this instance has been deleted
                  return [[...deleted, instanceBeingDeleted], beingDeleted];
                } else {
                  return [deleted, [...beingDeleted, instanceBeingDeleted]];
                }
              },
              [[], []]
            );

          // check also for new instances being deleted
          const newBeingDeleted = instances.filter(
            (i) =>
              [
                RegistryStatusValue.Deleting,
                RegistryStatusValue.Deprovision,
              ].includes(i.status as any) &&
              stillBeingDeleted.find((s) => s.id === i.id) === undefined
          );

          // recreate the deleted instances ref with the data derived before
          instancesBeingDeletedRef.current = [
            ...stillBeingDeleted,
            ...newBeingDeleted,
          ];

          // update the ref of instances for which we need to notify the user
          toNotifyRef.current = [
            ...toNotifyRef.current,
            ...ready.map(instanceToAlertable),
            ...failed.map(instanceToAlertable),
            ...deleted.map(instanceToAlertable),
          ];

          // snapshot the instances used in this run
          previousInstancesRef.current = instances;
        }
      }
    },
    [instances]
  );

  // check every second if the browser is visible, and if so send the queued
  // notifications
  useInterval(
    useCallback(
      function sendNotificationCb() {
        if (isVisible) {
          while (toNotifyRef.current.length > 0) {
            const instance = toNotifyRef.current.shift()!;
            switch (instance.status) {
              case RegistryStatusValue.Ready:
                notifyReady(instance.name);
                break;
              case RegistryStatusValue.Failed:
                notifyFailure(instance.name);
                break;
              case RegistryStatusValue.Deprovision:
              case RegistryStatusValue.Deleting:
                notifyDelete(instance.name);
                break;
            }
          }
        }
      },
      [isVisible, notifyDelete, notifyFailure, notifyReady]
    ),
    1000
  );
}

function instanceToAlertable(instance: Registry): AlertableInstance {
  return {
    name: instance.name!,
    status: instance.status as RegistryStatusValue,
  };
}
