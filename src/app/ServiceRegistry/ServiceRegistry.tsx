import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { Configuration, RegistryListRest, RegistryRest, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig, useBasename, useAlert } from '@rhoas/app-services-ui-shared';
import {
  ServiceRegistryDrawer,
  UnauthrizedUser,
  ServiceRegistryEmptyState,
  ServiceRegistryTableView,
} from './components';
import { ServiceRegistryHeader } from '@app/ServiceRegistry/components';
import { MASLoading, useRootModalContext, MODAL_TYPES, usePagination } from '@app/components';
import { useTimeout } from '@app/hooks';
import { MAX_POLL_INTERVAL } from '@app/constants';
import {InstanceType} from '@app/utils';
import { useSharedContext } from '@app/context';
import './ServiceRegistry.css';

export const ServiceRegistry: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig() || {srs:{apiBasePath:''}};

  const { addAlert } = useAlert() || {};
  const { showModal } = useRootModalContext();
  const { preCreateInstance, shouldOpenCreateModal,tokenEndPointUrl } = useSharedContext() || {};
  const {page=1, perPage=10}=usePagination() || {};

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [selectedRegistryInstance, setSelectedRegistryInstance] = useState<RegistryRest | undefined>(undefined);
  const [notRequiredDrawerContentBackground, setNotRequiredDrawerContentBackground] = useState<boolean>(false);
  const [isUnauthorizedUser, setIsUnauthorizedUser] = useState<boolean>(false);
  const [registries, setRegistries] = useState<RegistryListRest | undefined>(undefined);
  const [registryItems, setRegistryItems] = useState<RegistryRest[] | undefined>(undefined);
  const [loggedInUser, setLoggedInUser] = useState<string | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<string>('name asc');

  const hasUserTrialInstance = registryItems?.some((r) => r?.instance_type === InstanceType?.eval);

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
    if(basePath && accessToken){
      const api = new RegistriesApi(
        new Configuration({
          accessToken,
          basePath,
        })
      );
      await api
        .getRegistries()
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

  const onConnectToRegistry = (instance: RegistryRest | undefined) => {
    setIsExpandedDrawer(true);
    setSelectedRegistryInstance(instance);
  };

  const onCloseDrawer = () => {
    setIsExpandedDrawer(false);
  };

  const onDeleteRegistry = (registry: RegistryRest | undefined) => {
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

  const getAccessToServiceRegistry = () => {
    /**
     * Todo: integrate get access service registry api
     */
  };

  const openCreateModal = () => {
    showModal(MODAL_TYPES.CREATE_SERVICE_REGISTRY, {
      fetchServiceRegistries: fetchRegistries,
      hasUserTrialInstance
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

  if (isUnauthorizedUser) {
    return <UnauthrizedUser getAccessToServiceRegistry={getAccessToServiceRegistry} />;
  }

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
