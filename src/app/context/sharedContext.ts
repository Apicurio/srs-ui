import React, { useContext } from 'react';

export type SharedProps = {
    preCreateInstance?: (isOpen: boolean) => Promise<boolean>;
    shouldOpenCreateModal?: () => Promise<boolean>;
};

export const SharedContext = React.createContext<SharedProps | undefined>(undefined);
export const useSharedContext = (): SharedProps | undefined => useContext(SharedContext);
