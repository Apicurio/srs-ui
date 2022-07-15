import React, { MouseEvent, createContext, LegacyRef, useContext } from 'react';
import { RegistryStatusValue } from '@rhoas/registry-management-sdk';
import { css } from '@patternfly/react-styles';
import './CustomRowWrapper.css';
import { IRow, RowWrapperProps } from '@patternfly/react-table';

export type CustomRowWrapperContextProps = {
  activeRow?: string;
  onRowClick?: (event: MouseEvent, rowIndex?: number, row?: IRow) => void;
  rowDataTestId?: string;
  loggedInUser?: string;
} & RowWrapperProps;

const CustomRowWrapperContext = createContext<CustomRowWrapperContextProps>({
  activeRow: '',
  onRowClick: () => {
    // No-op
  },
  loggedInUser: '',
});

export const CustomRowWrapperProvider = CustomRowWrapperContext.Provider;

export const CustomRowWrapper = (rowWrapperProps: CustomRowWrapperContextProps) => {
  const { activeRow, onRowClick, rowDataTestId, loggedInUser } = useContext(CustomRowWrapperContext);
  const { trRef, className, rowProps, row, ...props } = rowWrapperProps;
  const { originalData } = row || {};
  const isRowDeleted =
    originalData?.status === RegistryStatusValue.Deprovision || originalData?.status === RegistryStatusValue.Deleting;
  const isLoggedInUserOwner = loggedInUser === row?.originalData?.owner;
  const isRowDisabled = isRowDeleted || !isLoggedInUserOwner;

  const ref = trRef === undefined ? undefined : (trRef as LegacyRef<HTMLTableRowElement>);

  const handleRowClick = (event: MouseEvent) => {
    if (!isRowDeleted) {
      onRowClick && onRowClick(event, rowProps?.rowIndex, row);
    }
  };

  return (
    <tr
      data-testid={rowDataTestId}
      tabIndex={!isRowDisabled ? 0 : undefined}
      ref={ref}
      className={css(
        className,
        'pf-c-table-row__item',
        isRowDeleted ? 'pf-m-disabled' : 'pf-m-selectable',
        !isRowDeleted && activeRow && activeRow === row?.originalData?.rowId && 'pf-m-selected'
      )}
      hidden={row?.isExpanded !== undefined && !row?.isExpanded}
      {...props}
      onClick={handleRowClick}
    />
  );
};
