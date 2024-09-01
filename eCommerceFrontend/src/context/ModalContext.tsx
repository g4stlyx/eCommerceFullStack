import React, { createContext, useContext, useState } from 'react';
import { AuthenticationRouteProps } from '../types/types';

interface ModalContextType {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  modalMessage: string;
  setModalMessage: (message: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<AuthenticationRouteProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const valueToBeShared : ModalContextType = {
    showModal,
    setShowModal,
    modalMessage,
    setModalMessage,
  }

  return (
    <ModalContext.Provider value={valueToBeShared}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};
