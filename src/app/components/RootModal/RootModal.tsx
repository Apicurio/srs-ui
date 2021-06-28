import React, { useState, createContext, useContext } from 'react';
import { CreateServiceRegistry, DeleteServiceRegistry } from '@app/ServiceRegistry/dialogs';

export const MODAL_TYPES = {
  CREATE_SERVICE_REGISTRY: 'CREATE_SERVICE_REGISTRY',
  DELETE_SERVICE_REGISTRY: 'DELETE_SERVICE_REGISTRY',
};

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.CREATE_SERVICE_REGISTRY]: CreateServiceRegistry,
  [MODAL_TYPES.DELETE_SERVICE_REGISTRY]:DeleteServiceRegistry
};

type RootModalContext = {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: any;
};

const initalState: RootModalContext = {
  showModal: () => {},
  hideModal: () => {},
  store: {},
};

const RootModalContext = createContext(initalState);
export const useRootModalContext = (): RootModalContext => useContext(RootModalContext);

export const RootModal = ({ children }) => {
  const [store, setStore] = useState();
  const { modalType, modalProps } = store || {};

  const showModal = (modalType: string, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: null,
      modalProps: {},
    });
  };

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent id="global-modal" {...modalProps} />;
  };

  return (
    <RootModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </RootModalContext.Provider>
  );
};
