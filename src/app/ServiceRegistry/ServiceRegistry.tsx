import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { Configuration, RegistryListRest, RegistryRest, ListRest, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@bf2/ui-shared';
import {
  ServiceRegistryDrawer,
  UnauthrizedUser,
  ServiceRegistryEmptyState,
  ServiceRegistryTableView,
} from './components';
import { ServiceRegistryHeader } from '@app/ServiceRegistry/components';
import { MASLoading, useRootModalContext, MODAL_TYPES } from '@app/components';
import { useTimeout } from '@app/hooks';
import { MAX_POLL_INTERVAL } from '@app/constants';

export const ServiceRegistry: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const { showModal } = useRootModalContext();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const perPage = parseInt(searchParams.get('perPage') || '', 10) || 10;

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [selectedRegistryInstance, setSelectedRegistryInstance] = useState<RegistryRest>(undefined);
  const [notRequiredDrawerContentBackground, setNotRequiredDrawerContentBackground] = useState<boolean>(false);
  const [isUnauthorizedUser, setIsUnauthorizedUser] = useState<boolean>(false);
  const [registry, setRegistry] = useState<ListRest | undefined>(undefined);
  const [registryItems, setRegistryItems] = useState<RegistryListRest | undefined>(undefined);
  const [loggedInUser, setLoggedInUser] = useState<string | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<string>('name asc');

  useEffect(() => {
    fetchRegistries();
  }, []);

  useEffect(() => {
    auth?.getUsername().then((username) => setLoggedInUser(username));
  }, [auth]);

  useEffect(() => {
    updateServiceRegistryInstance();
  }, [registryItems]);

  const updateServiceRegistryInstance = () => {
    if (registryItems && registryItems?.length > 0) {
      const selectedRegistryItem = registryItems?.filter(
        (registry) => registry?.id === selectedRegistryInstance?.id
      )[0];
      const newState: any = { ...selectedRegistryInstance, instanceDetail: selectedRegistryItem };
      selectedRegistryItem && setSelectedRegistryInstance(newState);
    }
  };

  const fetchRegistries = async () => {
    const accessToken = await auth?.srs.getToken();
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
        setRegistry(registry);
        setRegistryItems(registry?.items);
      })
      .catch((error) => {
        //todo: handle error
      });
  };

  useTimeout(() => fetchRegistries(), MAX_POLL_INTERVAL);

  const onConnectToRegistry = (instance: RegistryRest) => {
    setIsExpandedDrawer(true);
    setSelectedRegistryInstance(instance);
  };

  const onCloseDrawer = () => {
    setIsExpandedDrawer(false);
  };

  const onDeleteRegistry = (registry: RegistryRest) => {
    const { name, status } = registry;
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

  const createServiceRegistry = () => {
    showModal(MODAL_TYPES.CREATE_SERVICE_REGISTRY, {
      fetchServiceRegistries: fetchRegistries,
    });
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
          <ServiceRegistryHeader
            onConnectToRegistry={onConnectToRegistry}
            onDeleteRegistry={onDeleteRegistry}
            serviceRegistryDetails={selectedRegistryInstance}
          />
          <ServiceRegistryTableView
            page={page}
            perPage={perPage}
            serviceRegistryItems={registryItems}
            total={registry?.total}
            onViewConnection={onConnectToRegistry}
            onDelete={onDeleteRegistry}
            expectedTotal={0}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            loggedInUser={loggedInUser}
            currentUserkafkas={registryItems}
            handleCreateModal={createServiceRegistry}
            refresh={fetchRegistries}
            registryDataLoaded={false}
            setServiceRegistryDetails={setSelectedRegistryInstance}
          />
        </ServiceRegistryDrawer>
      );
    }
  }
};
