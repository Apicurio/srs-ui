import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MASDeleteModal, useRootModalContext } from '@app/components';
import { ServiceRegistryStatus } from '@app/utils';

export const DeleteServiceRegistry: React.FC = () => {
  const { t } = useTranslation();
  const { store, hideModal } = useRootModalContext();
  const { title, confirmButtonProps, cancelButtonProps, textProps, serviceRegistryStatus, selectedItemData, onClose } =
    store?.modalProps || {};

  const selectedInstanceName = selectedItemData?.name;

  const [instanceNameInput, setInstanceNameInput] = useState<string>();

  const handleInstanceName = (value: string) => {
    setInstanceNameInput(value);
  };

  const isConfirmButtonDisabled = () => {
    if (serviceRegistryStatus?.toLowerCase() === ServiceRegistryStatus.Available) {
      if (instanceNameInput?.toLowerCase() === selectedInstanceName?.toLowerCase()) {
        return false;
      }
      return true;
    }
    return false;
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter' && !isConfirmButtonDisabled()) {
      confirmButtonProps?.onClick && confirmButtonProps.onClick(selectedItemData);
    }
  };

  const handleToggle = () => {
    setInstanceNameInput('');
    hideModal();
    onClose && onClose();
  };

  return (
    <MASDeleteModal
      isModalOpen={true}
      title={title}
      confirmButtonProps={{
        isDisabled: isConfirmButtonDisabled(),
        'data-testid': 'modalDeleteRegistry-buttonDelete',
        ...confirmButtonProps,
      }}
      cancelButtonProps={cancelButtonProps}
      handleModalToggle={handleToggle}
      textProps={textProps}
      selectedItemData={selectedItemData}
      textInputProps={{
        showTextInput: serviceRegistryStatus?.toLowerCase() === ServiceRegistryStatus.Available,
        label: t('common.service_registry_name_label', { name: selectedInstanceName }),
        value: instanceNameInput,
        onChange: handleInstanceName,
        onKeyPress,
        autoFocus: true,
      }}
    ></MASDeleteModal>
  );
};
