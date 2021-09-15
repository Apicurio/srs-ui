import React, { useContext } from 'react';

export type SharedContextrops = {
    preCreateInstance?: (isOpen: boolean) => Promise<boolean>;
    shouldOpenCreateModal?: () => Promise<boolean>;
};

export const SharedContext = React.createContext<SharedContextrops | undefined>(undefined);
export const useSharedContext = (): SharedContextrops | undefined => useContext(SharedContext);
