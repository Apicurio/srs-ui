import { useEffect, useState, FunctionComponent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import {
  Configuration,
  RegistryList,
  Registry,
  RegistriesApi,
} from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@rhoas/app-services-ui-shared';
import {
  ServiceRegistryDrawer,
  ServiceRegistryEmptyState,
  ServiceRegistryTableView,
} from './components';
import { ServiceRegistryHeader } from '@app/ServiceRegistry/components';
import {
  MASLoading,
  useModal,
  ModalType,
  usePagination,
} from '@app/components';
import { useInterval } from '@app/hooks';
import { MAX_POLL_INTERVAL } from '@app/constants';
import { InstanceType } from '@app/utils';
import { useSharedContext } from '@app/context';
import './ServiceRegistry.css';

export const ServiceRegistry: FunctionComponent = () => {
  const { t } = useTranslation(['service-registry']);
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig() || { srs: { apiBasePath: '' } };

  const { showModal: showCreateServiceRegistryModal } =
    useModal<ModalType.CreateServiceRegistry>();
  const { showModal: showDeleteServiceRegistryModal } =
    useModal<ModalType.DeleteServiceRegistry>();
  const { preCreateInstance, shouldOpenCreateModal, renderDownloadArtifacts } =
    useSharedContext() || {};
  const { page = 1, perPage = 10 } = usePagination() || {};

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [selectedRegistryInstance, setSelectedRegistryInstance] = useState<
    Registry | undefined
  >(undefined);
  const [registries, setRegistries] = useState<RegistryList | undefined>(
    undefined
  );
  const [registryItems, setRegistryItems] = useState<Registry[] | undefined>(
    undefined
  );
  const [loggedInUser, setLoggedInUser] = useState<string | undefined>(
    undefined
  );
  const [orderBy, setOrderBy] = useState<string>('name asc');

  const hasUserTrialInstance = registryItems?.some(
    (r) => r?.instance_type === InstanceType?.eval && r.owner === loggedInUser
  );

  useEffect(() => {
    fetchRegistries();
  }, []);

  useEffect(() => {
    auth?.getUsername()?.then((username) => setLoggedInUser(username));
  }, [auth]);

  useEffect(() => {
    updateServiceRegistryInstance();
  }, [registryItems]);

  useEffect(() => {
    const openModal = async () => {
      const shouldOpen =
        shouldOpenCreateModal && (await shouldOpenCreateModal());
      shouldOpen && openCreateModal();
    };
    openModal();
  }, [shouldOpenCreateModal]);

  useEffect(() => {
    fetchRegistries();
  }, [page, perPage]);

  const updateServiceRegistryInstance = useCallback(() => {
    if (registryItems && registryItems?.length > 0) {
      const selectedRegistryItem = registryItems?.filter(
        (registry) => registry?.id === selectedRegistryInstance?.id
      )[0];
      const newState: any = {
        ...selectedRegistryInstance,
        ...selectedRegistryItem,
      };
      selectedRegistryItem && setSelectedRegistryInstance(newState);
    }
  }, [registryItems]);

  const fetchRegistries = useCallback(async () => {
    const accessToken = await auth?.srs.getToken();
    if (basePath && accessToken) {
      const api = new RegistriesApi(
        new Configuration({
          accessToken,
          basePath,
        })
      );

      await api.getRegistries(page, perPage).then((res) => {
        const registry = res?.data;
        setRegistries(registry);
        setRegistryItems(registry?.items);
      });
    }
  }, [page, perPage, basePath]);

  useInterval(() => fetchRegistries(), MAX_POLL_INTERVAL);

  const onConnectToRegistry = useCallback((instance: Registry | undefined) => {
    setIsExpandedDrawer(true);
    setSelectedRegistryInstance(instance);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setIsExpandedDrawer(false);
  }, []);

  const onDeleteRegistry = useCallback((registry: Registry | undefined) => {
    const { status } = registry || {};
    showDeleteServiceRegistryModal(ModalType.DeleteServiceRegistry, {
      status,
      registry,
      fetchServiceRegistries: fetchRegistries,
      confirmButtonProps: {
        label: t('common:delete'),
      },
      renderDownloadArtifacts,
    });
  }, []);

  const openCreateModal = useCallback(() => {
    showCreateServiceRegistryModal(ModalType.CreateServiceRegistry, {
      fetchServiceRegistries: fetchRegistries,
      hasUserTrialInstance,
    });
  }, []);

  const createServiceRegistry = useCallback(async () => {
    let open;
    if (preCreateInstance) {
      // Callback before opening create dialog
      // The callback can override the new state of opening
      open = await preCreateInstance(true);
    }
    open && openCreateModal();
  }, [preCreateInstance]);

  switch (true) {
    case registryItems === undefined:
      return (
        <PageSection
          variant={PageSectionVariants.light}
          padding={{ default: 'noPadding' }}
        >
          <MASLoading />
        </PageSection>
      );
    case !registryItems?.length:
      return (
        <>
          <ServiceRegistryHeader />
          <ServiceRegistryEmptyState
            onCreateserviceRegistry={createServiceRegistry}
          />
        </>
      );
    default:
      return (
        <ServiceRegistryDrawer
          isExpanded={isExpandedDrawer}
          isLoading={selectedRegistryInstance === undefined}
          onClose={onCloseDrawer}
          registry={selectedRegistryInstance}
        >
          <main className='pf-c-page__main'>
            <ServiceRegistryHeader
              onConnectToRegistry={onConnectToRegistry}
              onDeleteRegistry={onDeleteRegistry}
              serviceRegistryDetails={selectedRegistryInstance}
            />
            <ServiceRegistryTableView
              page={page}
              perPage={perPage}
              serviceRegistryItems={registryItems || []}
              total={registries?.total}
              onViewConnection={onConnectToRegistry}
              onDelete={onDeleteRegistry}
              expectedTotal={0}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              loggedInUser={loggedInUser}
              currentUserRegistries={registryItems}
              handleCreateModal={createServiceRegistry}
              refresh={fetchRegistries}
              registryDataLoaded={false}
              isDrawerOpen={isExpandedDrawer}
            />
          </main>
        </ServiceRegistryDrawer>
      );
  }
};
