import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { Configuration, RegistryList, Registry, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceRegistryDrawer, ServiceRegistryEmptyState, ServiceRegistryTableView } from './components';
import { ServiceRegistryHeader } from '@app/ServiceRegistry/components';
import { MASLoading, useRootModalContext, MODAL_TYPES, usePagination } from '@app/components';
import { useTimeout } from '@app/hooks';
import { MAX_POLL_INTERVAL } from '@app/constants';
import { InstanceType } from '@app/utils';
import { useSharedContext } from '@app/context';
import './ServiceRegistry.css';

export const ServiceRegistry: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig() || { srs: { apiBasePath: '' } };

  const { showModal } = useRootModalContext();
  const { preCreateInstance, shouldOpenCreateModal } = useSharedContext() || {};
  const { page = 1, perPage = 10 } = usePagination() || {};

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [selectedRegistryInstance, setSelectedRegistryInstance] = useState<Registry | undefined>(undefined);
  const [notRequiredDrawerContentBackground, setNotRequiredDrawerContentBackground] = useState<boolean>(false);
  const [registries, setRegistries] = useState<RegistryList | undefined>(undefined);
  const [registryItems, setRegistryItems] = useState<Registry[] | undefined>(undefined);
  const [loggedInUser, setLoggedInUser] = useState<string | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<string>('name asc');

  const hasUserTrialInstance = registryItems?.some(
    (r) => r?.instance_type === InstanceType?.eval && r.owner === loggedInUser
  );

  useEffect(() => {
    fetchRegistries();
  }, []);

  useEffect(() => {
    auth?.getUsername().then((username) => setLoggedInUser(username));
  }, [auth]);

  useEffect(() => {
    updateServiceRegistryInstance();
  }, [registryItems]);

  useEffect(() => {
    const openModal = async () => {
      const shouldOpen = shouldOpenCreateModal && (await shouldOpenCreateModal());
      shouldOpen && openCreateModal();
    };
    openModal();
  }, [shouldOpenCreateModal]);

  useEffect(() => {
    fetchRegistries();
  }, [page, perPage]);

  const updateServiceRegistryInstance = () => {
    if (registryItems && registryItems?.length > 0) {
      const selectedRegistryItem = registryItems?.filter(
        (registry) => registry?.id === selectedRegistryInstance?.id
      )[0];
      const newState: any = { ...selectedRegistryInstance, ...selectedRegistryItem };
      selectedRegistryItem && setSelectedRegistryInstance(newState);
    }
  };

  const fetchRegistries = async () => {
    const accessToken = await auth?.srs.getToken();
    if (basePath && accessToken) {
      const api = new RegistriesApi(
        new Configuration({
          accessToken,
          basePath,
        })
      );
      await api
        .getRegistries(page, perPage)
        .then((res) => {
          const registry = res?.data;
          setRegistries(registry);
          setRegistryItems(registry?.items);
        })
        .catch((error) => {
          //todo: handle error
        });
    }
  };

  useTimeout(() => fetchRegistries(), MAX_POLL_INTERVAL);

  const onConnectToRegistry = (instance: Registry | undefined) => {
    setIsExpandedDrawer(true);
    setSelectedRegistryInstance(instance);
  };

  const onCloseDrawer = () => {
    setIsExpandedDrawer(false);
  };

  const onDeleteRegistry = (registry: Registry | undefined) => {
    const { name, status } = registry || {};
    showModal(MODAL_TYPES.DELETE_SERVICE_REGISTRY, {
      serviceRegistryStatus: status,
      selectedItemData: registry,
      fetchRegistries,
      title: `${t('common.delete_service_registry_title')}?`,
      confirmButtonProps: {
        label: t('common.delete'),
      },
      textProps: {
        description: t('common.delete_service_registry_description', { name }),
      },
    });
  };

  const openCreateModal = () => {
    showModal(MODAL_TYPES.CREATE_SERVICE_REGISTRY, {
      fetchServiceRegistries: fetchRegistries,
      hasUserTrialInstance,
    });
  };

  const createServiceRegistry = async () => {
    let open;
    if (preCreateInstance) {
      // Callback before opening create dialog
      // The callback can override the new state of opening
      open = await preCreateInstance(true);
    }
    open && openCreateModal();
  };

  if (registryItems === undefined) {
    return (
      <PageSection variant={PageSectionVariants.light} padding={{ default: 'noPadding' }}>
        <MASLoading />
      </PageSection>
    );
  } else {
    if (!registryItems?.length) {
      return (
        <>
          <ServiceRegistryHeader />
          <ServiceRegistryEmptyState onCreateserviceRegistry={createServiceRegistry} />
        </>
      );
    } else {
      return (
        <ServiceRegistryDrawer
          isExpanded={isExpandedDrawer}
          isLoading={selectedRegistryInstance === undefined}
          notRequiredDrawerContentBackground={notRequiredDrawerContentBackground}
          onClose={onCloseDrawer}
          registry={selectedRegistryInstance}
        >
          <main className="pf-c-page__main">
            <ServiceRegistryHeader
              onConnectToRegistry={onConnectToRegistry}
              onDeleteRegistry={onDeleteRegistry}
              serviceRegistryDetails={selectedRegistryInstance}
            />
            <ServiceRegistryTableView
              page={page}
              perPage={perPage}
              serviceRegistryItems={registryItems}
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
  }
};
