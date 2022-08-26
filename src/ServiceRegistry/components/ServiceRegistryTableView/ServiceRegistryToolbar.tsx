import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@patternfly/react-core';
import { MASToolbar, ToolbarItemProps, MASPagination } from '@app/components';

export type ServiceRegistryToolbarProps = {
  total: number | undefined;
  page: number;
  perPage: number;
  handleCreateModal: () => void;
};

const ServiceRegistryToolbar: FC<ServiceRegistryToolbarProps> = ({
  total,
  page,
  perPage,
  handleCreateModal,
}) => {
  const { t } = useTranslation(['service-registry', 'common']);

  const onClearAllFilters = () => {};

  const toolbarItems: ToolbarItemProps[] = [
    {
      item: (
        <Button
          variant='primary'
          onClick={handleCreateModal}
          data-testid={'tableServiceRegistry-buttonCreateServiceRegistry'}
        >
          {t('create_service_registry')}
        </Button>
      ),
    },
  ];

  if (total && total > 0 && toolbarItems.length > 0) {
    toolbarItems.push({
      item: (
        <MASPagination
          widgetId='pagination-options-menu-top'
          itemCount={total}
          page={page}
          perPage={perPage}
          isCompact={true}
          titles={{
            paginationTitle: t('minimal_pagination'),
            perPageSuffix: t('per_page_suffix'),
            toFirstPage: t('to_first_page'),
            toPreviousPage: t('to_previous_page'),
            toLastPage: t('to_last_page'),
            toNextPage: t('to_next_page'),
            optionsToggle: t('options_toggle'),
            currPage: t('curr_page'),
          }}
        />
      ),
      variant: 'pagination',
      alignment: { default: 'alignRight' },
    });
  }

  return (
    <MASToolbar
      toolbarProps={{
        id: 'registry-instance-toolbar',
        clearAllFilters: onClearAllFilters,
        collapseListedFiltersBreakpoint: 'md',
        inset: { xl: 'insetLg' },
      }}
      toolbarItems={toolbarItems}
    />
  );
};

export { ServiceRegistryToolbar };
