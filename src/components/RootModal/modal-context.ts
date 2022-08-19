import { useContext, createContext } from "react";
import { ModalType, ModalContextProps } from "./types";

export const ModalContext = createContext<ModalContextProps<ModalType> | undefined>(undefined);

export const useModal = <T extends ModalType>(): ModalContextProps<T> => {
    const answer = useContext(ModalContext);
    if (answer === undefined) {
        throw new Error('not inside modal provider');
    }
    return answer;
};