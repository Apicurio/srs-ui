import { useContext, createContext } from 'react';
import { Registry } from '@rhoas/registry-management-sdk';

export type SharedContextrops = {
    preCreateInstance?: (isOpen: boolean) => Promise<boolean>;
    shouldOpenCreateModal?: () => Promise<boolean>;
    tokenEndPointUrl?: string;
    artifactId?: string;
    renderDownloadArtifacts?: (registry: Registry, downloadLabel: string) => string;
};

export const SharedContext = createContext<SharedContextrops | undefined>(undefined);
export const useSharedContext = (): SharedContextrops | undefined => useContext(SharedContext);
