import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { Configuration, RegistryListRest, RegistryRest, ListRest, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useBasename, useConfig } from '@bf2/ui-shared';
import {
  ServiceRegistryDrawer,
  UnauthrizedUser,
  ServiceRegistryEmptyState,
  ServiceRegistryTableView,
} from './components';
import { ServiceRegistryHeader, ServiceRegistryHeaderProps } from '@app/ServiceRegistry/components';
import { MASLoading, useRootModalContext, MODAL_TYPES } from '@app/components';

export type ServiceRegistryProps = ServiceRegistryHeaderProps & {
  render: (registry: RegistryRest) => JSX.Element;
};

export const ServiceRegistry: React.FC<ServiceRegistryProps> = ({ render, breadcrumbId }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const history = useHistory();
  const basename = useBasename();
  const { showModal } = useRootModalContext();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const perPage = parseInt(searchParams.get('perPage') || '', 10) || 10;

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceRegistryDetails, setServiceRegistryDetails] = useState<RegistryRest>(undefined);
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

  const fetchRegistries = async () => {
    const accessToken = await auth?.srs.getToken();
    setLoading(true);
    const api = new RegistriesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );

    await api
      .getRegistries()
      .then((res) => {
        setLoading(false);
        const registry = res?.data;
        setRegistry(registry);
        setRegistryItems(registry?.items);
      })
      .catch((error) => {
        setLoading(false);
        //todo: handle error
      });
  };

  const onConnectToRegistry = (instance: RegistryRest) => {
    setIsExpandedDrawer(true);
    setServiceRegistryDetails(instance);
  };

  const onCloseDrawer = () => {
    setIsExpandedDrawer(false);
  };

  const deleteRegistry = async (registry: RegistryRest) => {
    const accessToken = await auth?.srs.getToken();
    if (registry?.id) {
      setLoading(true);
      const api = new RegistriesApi(
        new Configuration({
          accessToken,
          basePath,
        })
      );
      try {
        await api.deleteRegistry(registry?.id).then(() => {
          setLoading(false);
          history.push(basename.getBasename());
          fetchRegistries && fetchRegistries();
        });
      } catch (error) {
        setLoading(false);
        // TODO Swallowing the error
      }
    }
  };

  const onDeleteRegistry = (registry: RegistryRest) => {
    const { name, status } = registry;
    showModal(MODAL_TYPES.DELETE_SERVICE_REGISTRY, {
      serviceRegistryStatus: status,
      selectedItemData: registry,
      title: `${t('common.delete_service_registry_title')}?`,
      confirmButtonProps: {
        onClick: deleteRegistry,
        label: t('common.delete'),
        isLoading: loading,
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
          isLoading={serviceRegistryDetails === undefined}
          notRequiredDrawerContentBackground={notRequiredDrawerContentBackground}
          onClose={onCloseDrawer}
          registry={serviceRegistryDetails}
        >
          <ServiceRegistryHeader
            onConnectToRegistry={onConnectToRegistry}
            onDeleteRegistry={onDeleteRegistry}
            breadcrumbId={breadcrumbId}
            serviceRegistryDetails={serviceRegistryDetails}
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
          />
          {/* {render(registry)} */}
        </ServiceRegistryDrawer>
      );
    }
  }
};
