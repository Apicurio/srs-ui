import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertVariant, PageSection, PageSectionVariants, Text } from '@patternfly/react-core';
import { Configuration, RegistryListRest, RegistryRest, RegistriesApi } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig, useBasename, useAlert } from '@bf2/ui-shared';
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
import './ServiceRegistry.css';

export const ServiceRegistry: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const basename = useBasename();
  const { addAlert } = useAlert();
  const { showModal } = useRootModalContext();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const perPage = parseInt(searchParams.get('perPage') || '', 10) || 10;

  const [isExpandedDrawer, setIsExpandedDrawer] = useState<boolean>(false);
  const [selectedRegistryInstance, setSelectedRegistryInstance] = useState<RegistryRest | undefined>(undefined);
  const [notRequiredDrawerContentBackground, setNotRequiredDrawerContentBackground] = useState<boolean>(false);
  const [isUnauthorizedUser, setIsUnauthorizedUser] = useState<boolean>(false);
  const [registries, setRegistries] = useState<RegistryListRest | undefined>(undefined);
  const [registryItems, setRegistryItems] = useState<RegistryRest[] | undefined>(undefined);
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
      const newState: any = { ...selectedRegistryInstance, ...selectedRegistryItem };
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
        setRegistries(registry);
        setRegistryItems(registry?.items);
      })
      .catch((error) => {
        //todo: handle error
      });
  };

  useTimeout(() => fetchRegistries(), MAX_POLL_INTERVAL);


  const downloadArtifactsZip = async (registryUrl?: string, name?: string) => {

    const accessToken = await auth?.apicurio_registry.getToken();

    fetch(`${registryUrl}/apis/registry/v2/admin/export`, {
      headers: new Headers({
        "Authorization": `Bearer ${accessToken}` || ""
      })
    })
      .then(response => {
        return response.blob()
      })
      .then(data => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = `${name}.zip`;
        link.click();
      }).catch(error => {
        addAlert({
          title: t('something_went_wrong'),
          variant: AlertVariant.danger,
          description: error?.response?.data?.reason,
        });
      })
  };

  const onConnectToRegistry = (instance: RegistryRest | undefined) => {
    setIsExpandedDrawer(true);
    setSelectedRegistryInstance(instance);
  };

  const onCloseDrawer = () => {
    setIsExpandedDrawer(false);
  };

  const onDeleteRegistry = (registry: RegistryRest | undefined) => {
    const { name, status, registryUrl } = registry || {};
    showModal(MODAL_TYPES.DELETE_SERVICE_REGISTRY, {
      serviceRegistryStatus: status,
      selectedItemData: registry,
      fetchRegistries,
      title: `${t('common.delete_service_registry_title')}?`,
      confirmButtonProps: {
        label: t('common.delete'),
      },
      textProps: {
        descriptionHTML: (
          <>
            <Text className='mas--delete-item__modal--text'>
              <span dangerouslySetInnerHTML={{ __html: t('common.delete_service_registry_description', { name }) }} />
            </Text>
            <Text className='mas--delete-item__modal--text'>
              {t('common.delete_service_registry_download_zip')}
              &nbsp;
              <Link onClick={() => downloadArtifactsZip(registryUrl, name)} to="#">{t('common.delete_service_registry_download_zip_link')}</Link>
            </Text>
          </>
        )
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
