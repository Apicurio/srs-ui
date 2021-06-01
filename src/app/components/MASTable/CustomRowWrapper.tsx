import React, { createContext, useContext } from 'react';
import { css } from '@patternfly/react-styles';
import './CustomRowWrapper.css';

export type CustomRowWrapperContextProps = {
  activeRow?: string;
  onRowClick?: (event: MouseEvent, rowIndex: number, row: any) => void;
  rowDataTestId?: string;
  loggedInUser?: string;
};

const CustomRowWrapperContext = createContext<CustomRowWrapperContextProps>({
  activeRow: '',
  onRowClick: () => {},
  loggedInUser: '',
});

export const CustomRowWrapperProvider = CustomRowWrapperContext.Provider;

export const CustomRowWrapper = (rowWrapperProps) => {
  const { activeRow, onRowClick, rowDataTestId } = useContext(CustomRowWrapperContext);
  const { trRef, className, rowProps, row, ...props } = rowWrapperProps || {};
  const { rowIndex } = rowProps;
  const { isExpanded, originalData } = row;

  return (
    <tr
      data-testid={rowDataTestId}
      tabIndex={0}
      ref={trRef}
      className={css(
        className,
        'pf-c-table-row__item',
        activeRow && activeRow === originalData?.name && 'pf-m-selected'
      )}
      hidden={isExpanded !== undefined && !isExpanded}
      onClick={(event: MouseEvent) => onRowClick && onRowClick(event, rowIndex, row)}
      {...props}
    />
  );
};
