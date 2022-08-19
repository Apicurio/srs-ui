// A map of modal components to their lazy loaded implementations
import { FunctionComponent, LazyExoticComponent, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from './modal-context';
import {
  ModalRegistry,
  ModalType,
  CreateServiceRegistryProps,
  DeleteServiceRegistryProps,
} from './types';

export const useServiceRegistryModals = (): ModalRegistry => {
  const { t } = useTranslation();
  return {
    [ModalType.CreateServiceRegistry]: {
      lazyComponent: lazy(
        () =>
          import(
            /* webpackPrefetch: true */ '@app/ServiceRegistry/dialogs/CreateServiceRegistry/CreateServiceRegistry'
          )
      ) as LazyExoticComponent<FunctionComponent<CreateServiceRegistryProps>>,
      variant: 'medium',
    },
    [ModalType.DeleteServiceRegistry]: {
      lazyComponent: lazy(
        () =>
          import(
            /* webpackPrefetch: true */ '@app/ServiceRegistry/dialogs/DeleteServiceRegistry/DeleteServiceRegistry'
          )
      ) as LazyExoticComponent<FunctionComponent<DeleteServiceRegistryProps>>,
      variant: 'medium',
      title: `${t('common.delete_service_registry_title')}?`,
    },
  };
};

export const ServiceRegistryModalLoader: FunctionComponent = () => {
  const { registerModals } = useModal();
  const modals = useServiceRegistryModals();
  registerModals(modals);
  return <></>;
};
