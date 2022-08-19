import { Registry, RegistryStatusValue } from '@rhoas/registry-management-sdk';

export type CreateServiceRegistryProps = {
    hasUserTrialInstance: boolean | undefined;
    fetchServiceRegistries: () => Promise<void>;
}

export type DeleteServiceRegistryProps = {
    shouldRedirect?: boolean;
    status: RegistryStatusValue | undefined,
    registry: Registry | undefined,
    fetchServiceRegistries?: () => Promise<void>;
    renderDownloadArtifacts?: (registry: Registry, downloadLabel: string) => string;
    confirmButtonProps: {
        label: string;
    }
}

export enum ModalType {
    CreateServiceRegistry = 'CreateServiceRegistry',
    DeleteServiceRegistry = 'DeleteServiceRegistry',
}

// A map of modal types to their props
export interface ModalTypePropsMap {
    [ModalType.CreateServiceRegistry]: CreateServiceRegistryProps;
    [ModalType.DeleteServiceRegistry]: DeleteServiceRegistryProps;
}


export type ModalContextProps<T extends ModalType> = {
    registerModals: (modals: ModalRegistry) => void;
    showModal: (modalType: ModalType, modalProps: ModalTypePropsMap[T]) => void;
    hideModal: () => void;
};


export type ActiveModalProps<T extends ModalType> = {
    modalType: T;
    modalProps: ModalTypePropsMap[T];
};

// Properties available to all Modal components
export type BaseModalProps = {
    hideModal: () => void;
    title?: string;
    variant?: 'small' | 'medium' | 'large' | 'default';
};

export type ModalRegistryEntry<T extends ModalType> = {
    lazyComponent: React.LazyExoticComponent<
        React.FunctionComponent<ModalTypePropsMap[T] & BaseModalProps>
    >;
} & Pick<BaseModalProps, 'variant' | 'title'>;

export type ModalRegistry = {
    [T in ModalType]?: ModalRegistryEntry<T>;
};