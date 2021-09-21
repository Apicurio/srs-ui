import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IAction, IExtraColumnData, IRowData, ISeparator, ISortBy, SortByDirection } from '@patternfly/react-table';
import { PageSection, PageSectionVariants, Card } from '@patternfly/react-core';
import { PaginationVariant } from '@patternfly/react-core';
import { RegistryRest, RegistryStatusValueRest } from '@rhoas/registry-management-sdk';
import { useBasename, useAlert, AlertVariant, useAuth } from '@rhoas/app-services-ui-shared';
import { getFormattedDate } from '@app/utils';
import { MASEmptyState, MASEmptyStateVariant, MASPagination, MASTable } from '@app/components';
import { StatusColumn } from './StatusColumn';
import { ServiceRegistryToolbar, ServiceRegistryToolbarProps } from './ServiceRegistryToolbar';

export type ServiceRegistryTableViewProps = ServiceRegistryToolbarProps & {
  serviceRegistryItems: RegistryRest[];
  onViewConnection: (instance: RegistryRest) => void;
  refresh: (arg0?: boolean) => void;
  registryDataLoaded: boolean;
  onDelete: (instance: RegistryRest) => void;
  expectedTotal: number;
  orderBy: string;
  setOrderBy: (order: string) => void;
  isDrawerOpen?: boolean;
  loggedInUser: string | undefined;
  currentUserRegistries: RegistryRest[] | undefined;
};

const ServiceRegistryTableView: React.FC<ServiceRegistryTableViewProps> = ({
  serviceRegistryItems,
  onViewConnection,
  refresh,
  registryDataLoaded,
  onDelete,
  expectedTotal,
  orderBy,
  setOrderBy,
  isDrawerOpen,
  loggedInUser,
  currentUserRegistries,
  total = 0,
  page,
  perPage,
  handleCreateModal,
}) => {
  const { addAlert } = useAlert();
  const { getBasename } = useBasename();
  const basename = getBasename();
  const { t } = useTranslation();
  const auth = useAuth();

  const [activeRow, setActiveRow] = useState<string>();
  const [deletedRegistries, setDeletedRegistries] = useState<string[]>([]);
  const [instances, setInstances] = useState<Array<RegistryRest>>([]);
  const [isOrgAdmin, setIsOrgAdmin] = useState<boolean>();

  const tableColumns = [
    { title: t('common.name') },
    { title: t('common.owner') },
    { title: t('common.status') },
    { title: t('common.time_created') },
  ];

  useEffect(() => {
    if (!isDrawerOpen) {
      setActiveRow('');
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    auth?.isOrgAdmin().then((isOrgAdmin) => setIsOrgAdmin(isOrgAdmin));
  }, [auth]);

  const removeRegistryFromList = (name: string) => {
    const index = deletedRegistries.findIndex((r) => r === name);
    if (index > -1) {
      const newDeletedRegistries = Object.assign([], deletedRegistries);
      newDeletedRegistries.splice(index, 1);
      setDeletedRegistries(newDeletedRegistries);
    }
  };

  const addAlertAfterSuccessDeletion = () => {
    if (currentUserRegistries) {
      // filter all registry with status as deprovision or deleting
      const deprovisonedRegistries: RegistryRest[] = currentUserRegistries.filter(
        (r) => r.status === RegistryStatusValueRest.Deprovision || r.status === RegistryStatusValueRest.Deleting
      );

      // filter all new registry which is not in deleteRegistry state
      const notPresentRegistries = deprovisonedRegistries
        .filter((r) => deletedRegistries.findIndex((dr) => dr === r.name) < 0)
        .map((r) => r.name || '');

      // create new array by merging old and new registry with status as deprovion
      const allDeletedRegistries: string[] = [...deletedRegistries, ...notPresentRegistries];
      setDeletedRegistries(allDeletedRegistries);

      // add alert for deleted registry which are completely deleted from the response
      allDeletedRegistries.forEach((registryName) => {
        const registryIndex = currentUserRegistries?.findIndex((item) => item.name === registryName);
        if (registryIndex < 0) {
          removeRegistryFromList(registryName);
          addAlert({
            title: t('srs.service_registry_successfully_deleted', { name: registryName }),
            variant: AlertVariant.success,
          });
        }
      });
    }
  };

  const addAlertAfterSuccessCreation = () => {
    const lastItemsState: RegistryRest[] = JSON.parse(JSON.stringify(instances));
    if (instances && instances.length > 0) {
      const completedOrFailedItems = Object.assign([], serviceRegistryItems).filter(
        (item: RegistryRest) =>
          item.status === RegistryStatusValueRest.Ready || item.status === RegistryStatusValueRest.Failed
      );
      lastItemsState.forEach((item: RegistryRest) => {
        const filteredInstances: RegistryRest[] = completedOrFailedItems.filter(
          (cfItem: RegistryRest) => item.id === cfItem.id
        );
        if (filteredInstances && filteredInstances.length > 0) {
          const { status, name } = filteredInstances[0];

          if (status === RegistryStatusValueRest.Ready) {
            addAlert({
              title: t('srs.registry_successfully_created'),
              variant: AlertVariant.success,
              description: <span dangerouslySetInnerHTML={{ __html: t('srs.registry_success_message', { name }) }} />,
              dataTestId: 'toastCreateRegistry-success',
            });
          } else if (status === RegistryStatusValueRest.Failed) {
            addAlert({
              title: t('srs.registry_not_created'),
              variant: AlertVariant.danger,
              description: <span dangerouslySetInnerHTML={{ __html: t('srs.registry_failed_message', { name }) }} />,
              dataTestId: 'toastCreateRegistry-failed',
            });
          }
        }
      });
    }

    const incompleteRegistry = Object.assign(
      [],
      serviceRegistryItems?.filter(
        (r: RegistryRest) =>
          r.status === RegistryStatusValueRest.Provisioning || r.status === RegistryStatusValueRest.Accepted
      )
    );
    setInstances(incompleteRegistry);
  };

  useEffect(() => {
    // handle success alert for deletion
    addAlertAfterSuccessDeletion();
    // handle success alert for creation
    addAlertAfterSuccessCreation();
  }, [page, perPage, serviceRegistryItems, currentUserRegistries]);

  const renderNameLink = ({ name, row }) => {
    return (
      <Link to={`${basename}/t/${row?.id}`} data-testid="tableRegistries-linkKafka">
        {name}
      </Link>
    );
  };

  const preparedTableCells = () => {
    const tableRow: (IRowData | string[])[] | undefined = [];
    serviceRegistryItems?.forEach((row: IRowData) => {
      const { name, created_at, status, owner } = row;
      tableRow.push({
        cells: [
          {
            title: status?.toLowerCase() !== RegistryStatusValueRest.Ready ? name : renderNameLink({ name, row }),
          },
          owner,
          {
            title: <StatusColumn status={status} instanceName={name} />,
          },
          {
            title: getFormattedDate(created_at, t('ago')),
          },
        ],
        originalData: { ...row, rowId: row?.id },
      });
    });
    return tableRow;
  };

  const onSelectKebabDropdownOption = (
    event: React.ChangeEvent<HTMLSelectElement>,
    originalData: RegistryRest,
    selectedOption: string
  ) => {
    if (selectedOption === 'connect-instance') {
      onViewConnection(originalData);
      setActiveRow(originalData?.id);
    } else if (selectedOption === 'delete-instance') {
      onDelete(originalData);
    }
    // Set focus back on previous selected element i.e. kebab button
    const previousNode = event?.target?.parentElement?.parentElement?.previousSibling;
    if (previousNode !== undefined && previousNode !== null) {
      (previousNode as HTMLElement).focus();
    }
  };

  const actionResolver = (rowData: IRowData) => {
    const originalData: RegistryRest = rowData.originalData;
    const isUserSameAsLoggedIn = originalData.owner === loggedInUser || isOrgAdmin;
    let additionalProps: any;

    if (!isUserSameAsLoggedIn) {
      additionalProps = {
        tooltip: true,
        isDisabled: true,
        style: {
          pointerEvents: 'auto',
          cursor: 'default',
        },
      };
    }
    const resolver: (IAction | ISeparator)[] = [
      {
        title: t('srs.view_connection_information'),
        id: 'connect-instance',
        ['data-testid']: 'tableRegistry-actionConnection',
        onClick: (event: any) =>
          isUserSameAsLoggedIn && onSelectKebabDropdownOption(event, originalData, 'connect-instance'),
        ...additionalProps,
        tooltipProps: {
          position: 'left',
          content: t('common.no_permission_to_connect_registry'),
        },
      },
      {
        title: t('srs.delete_registry'),
        id: 'delete-instance',
        ['data-testid']: 'tableRegistry-actionDelete',
        onClick: (event: any) =>
          isUserSameAsLoggedIn && onSelectKebabDropdownOption(event, originalData, 'delete-instance'),
        ...additionalProps,
        tooltipProps: {
          position: 'left',
          content: t('common.no_permission_to_delete_service_registry'),
        },
      },
    ];
    return resolver;
  };

  const getParameterForSortIndex = (index: number) => {
    switch (index) {
      case 0:
        return 'name';
      case 1:
        return 'owner';
      case 2:
        return 'status';
      case 3:
        return 'created_at';
      default:
        return '';
    }
  };

  const getindexForSortParameter = (parameter: string) => {
    switch (parameter.toLowerCase()) {
      case 'name':
        return 0;
      case 'owner':
        return 1;
      case 'status':
        return 2;
      case 'created_at':
        return 3;
      default:
        return undefined;
    }
  };

  const getSortBy = (): ISortBy | undefined => {
    const sort: string[] = orderBy?.split(' ') || [];
    if (sort.length > 1) {
      return {
        index: getindexForSortParameter(sort[0]),
        direction: sort[1] === SortByDirection.asc ? SortByDirection.asc : SortByDirection.desc,
      };
    }
    return;
  };

  const onSort = (_event: any, index: number, direction: string, extraData: IExtraColumnData) => {
    let myDirection = direction;
    if (getSortBy()?.index !== index && extraData.property === 'time-created') {
      // trick table to sort descending first for date column
      // https://github.com/patternfly/patternfly-react/issues/5329
      myDirection = 'desc';
    }
    setOrderBy(`${getParameterForSortIndex(index)} ${myDirection}`);
  };

  const onRowClick = (event: any, rowIndex: number, row: IRowData) => {
    const { originalData } = row;
    const clickedEventType = event?.target?.type;
    const tagName = event?.target?.tagName;

    // Open modal on row click except kebab button click
    if (clickedEventType !== 'button' && tagName?.toLowerCase() !== 'a') {
      onViewConnection(originalData);
      setActiveRow(originalData?.id);
    }
  };

  return (
    <PageSection
      className="registry--main-page__page-section--table pf-m-padding-on-xl"
      variant={PageSectionVariants.default}
      // padding={{ default: 'noPadding' }}
    >
      <Card>
        <ServiceRegistryToolbar page={page} perPage={perPage} total={total} handleCreateModal={handleCreateModal} />
        <MASTable
          tableProps={{
            cells: tableColumns,
            rows: preparedTableCells(),
            'aria-label': t('common.registry_instance_list'),
            actionResolver: actionResolver,
            onSort: onSort,
            sortBy: getSortBy(),
            hasDefaultCustomRowWrapper: true,
          }}
          activeRow={activeRow}
          onRowClick={onRowClick}
          rowDataTestId="tableRegistry-row"
          loggedInUser={loggedInUser}
        />
        {serviceRegistryItems.length < 1 && registryDataLoaded && (
          <MASEmptyState
            emptyStateProps={{
              variant: MASEmptyStateVariant.NoResult,
            }}
            titleProps={{
              title: t('common.no_results_found'),
            }}
            emptyStateBodyProps={{
              body: t('common.adjust_your_filters_and_try_again'),
            }}
          />
        )}
        {total > 0 && (
          <MASPagination
            widgetId="pagination-options-menu-bottom"
            itemCount={total}
            variant={PaginationVariant.bottom}
            page={page}
            perPage={perPage}
            titles={{
              paginationTitle: t('common.full_pagination'),
              perPageSuffix: t('common.per_page_suffix'),
              toFirstPage: t('common.to_first_page'),
              toPreviousPage: t('common.to_previous_page'),
              toLastPage: t('common.to_last_page'),
              toNextPage: t('common.to_next_page'),
              optionsToggle: t('common.options_toggle'),
              currPage: t('common.curr_page'),
            }}
          />
        )}
      </Card>
    </PageSection>
  );
};

export { ServiceRegistryTableView };
