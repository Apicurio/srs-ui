import { useContext } from 'react';
import { ModalType, ModalContextProps } from './types';
import { ModalContext } from './ModalContext';

export const useModal = <T extends ModalType>(): ModalContextProps<T> => {
  const answer = useContext(ModalContext);
  if (answer === undefined) {
    throw new Error('not inside modal provider');
  }
  return answer;
};
