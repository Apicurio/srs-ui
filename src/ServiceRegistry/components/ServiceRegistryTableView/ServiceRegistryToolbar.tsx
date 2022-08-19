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
  const { t } = useTranslation();

  const onClearAllFilters = () => {};

  const toolbarItems: ToolbarItemProps[] = [
    {
      item: (
        <Button
          variant='primary'
          onClick={handleCreateModal}
          data-testid={'tableServiceRegistry-buttonCreateServiceRegistry'}
        >
          {t('srs.create_service_registry')}
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
            paginationTitle: t('common.minimal_pagination'),
            perPageSuffix: t('common.per_page_suffix'),
            toFirstPage: t('common.to_first_page'),
            toPreviousPage: t('common.to_previous_page'),
            toLastPage: t('common.to_last_page'),
            toNextPage: t('common.to_next_page'),
            optionsToggle: t('common.options_toggle'),
            currPage: t('common.curr_page'),
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
