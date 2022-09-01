import { FunctionComponent, ReactNode } from 'react';
import {
  Modal,
  Button,
  ButtonVariant,
  ModalVariant,
  ModalProps,
  ButtonProps,
  TextProps,
  TextInput,
  TextInputProps,
  CheckboxProps,
  Form,
  FormGroup,
  Checkbox,
} from '@patternfly/react-core';
import { getModalAppendTo } from '@app/utils';
import './MASDeleteModal.css';
import { useTranslation } from 'react-i18next';

export type MASDeleteModalProps = {
  isModalOpen: boolean;
  title: string;
  modalProps?: Omit<ModalProps, 'children' | 'ref'>;
  handleModalToggle: () => void;
  children?: React.ReactNode;
  selectedItemData?: any;
  confirmButtonProps?: Omit<ButtonProps, 'children' | 'onClick'> & {
    id?: string;
    key?: string;
    label?: string;
    onClick?: (data?: any) => Promise<void> | void;
    'data-testid'?: string;
  };
  cancelButtonProps?: Omit<ButtonProps, 'children'> & {
    id?: string;
    key?: string;
    label?: string;
  };
  textProps?: Omit<TextProps, 'children'> & {
    description?: string | ReactNode;
  };
  textInputProps?: TextInputProps & {
    showTextInput: boolean;
    label: string;
    value: string | undefined;
  };
  checkboxProps?: CheckboxProps & {
    id?: string;
    isDownloaded: boolean;
    isChecked: boolean;
    onChange: () => void;
  };
};

export const MASDeleteModal: FunctionComponent<MASDeleteModalProps> = ({
  isModalOpen,
  title,
  modalProps,
  confirmButtonProps,
  cancelButtonProps,
  handleModalToggle,
  textProps,
  children,
  selectedItemData = '',
  textInputProps,
  checkboxProps,
}: MASDeleteModalProps) => {
  const { t } = useTranslation('service-registry');

  const {
    variant = ModalVariant.small,
    titleIconVariant = 'warning',
    ['aria-label']: ariaLabel,
    showClose = true,
    ...restModalProps
  } = modalProps || {};

  const {
    id = 'mas--confirm__button',
    key = 'confirm-button',
    variant: buttonConfirmVariant = ButtonVariant.danger,
    onClick: onClickConfirmButton,
    isDisabled: isDisabledConfirmButton,
    label: confirmActionLabel = 'Delete',
    isLoading,
    ...restConfirmButtonProps
  } = confirmButtonProps || {};

  const {
    id: cancelButtonId = 'mas--cancel__button',
    key: cancelButtonKey = '"cancel-button',
    variant: cancelButtonVariant = ButtonVariant.link,
    label: cancelActionLabel = 'Cancel',
    ...restCancelButtonProps
  } = cancelButtonProps || {};

  const {
    isDownloaded: isDownloaded,
    isChecked: isChecked,
    onChange: onChangeCheckbox,
  } = checkboxProps || {};

  const { description } = textProps || {};
  const {
    label = '',
    value,
    onChange,
    onKeyPress,
    showTextInput,
    ...restInputFieldProps
  } = textInputProps || {};

  return (
    <Modal
      variant={variant}
      isOpen={isModalOpen}
      aria-label={ariaLabel}
      title={title}
      titleIconVariant={titleIconVariant}
      showClose={showClose}
      onClose={handleModalToggle}
      appendTo={getModalAppendTo()}
      actions={[
        <Button
          id={id}
          key={key}
          variant={buttonConfirmVariant}
          onClick={() =>
            onClickConfirmButton && onClickConfirmButton(selectedItemData)
          }
          isDisabled={isDisabledConfirmButton}
          isLoading={isLoading}
          {...restConfirmButtonProps}
        >
          {confirmActionLabel}
        </Button>,
        <Button
          id={cancelButtonId}
          key={cancelButtonKey}
          variant={cancelButtonVariant}
          onClick={handleModalToggle}
          {...restCancelButtonProps}
        >
          {cancelActionLabel}
        </Button>,
      ]}
      {...restModalProps}
    >
      {description}
      {showTextInput && (
        <Form onSubmit={(event) => event.preventDefault()}>
          <FormGroup fieldId={'text-input'}>
            <label
              htmlFor='mas-name-input'
              dangerouslySetInnerHTML={{ __html: label }}
            />
            <TextInput
              id='mas--name__input'
              name='mas-name-input'
              type='text'
              value={value}
              onChange={onChange}
              onKeyPress={onKeyPress}
              autoFocus={true}
              {...restInputFieldProps}
            />
          </FormGroup>
          <FormGroup fieldId={'checkbox'}>
            <Checkbox
              label={
                isDownloaded
                  ? t('checkbox_label_after_the_download_click')
                  : t('checkbox_label_before_the_download_click')
              }
              aria-label='uncontrolled checkbox example'
              id={id}
              className='pf-u-font-size-sm'
              isChecked={isChecked}
              onChange={onChangeCheckbox}
            />
          </FormGroup>
        </Form>
      )}
      {children}
    </Modal>
  );
};
