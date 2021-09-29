import React, { useContext } from 'react';
import { RegistryRest } from '@rhoas/registry-management-sdk';

export type SharedContextrops = {
    preCreateInstance?: (isOpen: boolean) => Promise<boolean>;
    shouldOpenCreateModal?: () => Promise<boolean>;
    tokenEndPointUrl?: string;
    renderDownloadArtifacts?: (registry: RegistryRest, downloadLabel?: string) => JSX.Element;
};

export const SharedContext = React.createContext<SharedContextrops | undefined>(undefined);
export const useSharedContext = (): SharedContextrops | undefined => useContext(SharedContext);
