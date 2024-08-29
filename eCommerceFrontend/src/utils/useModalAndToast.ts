import { useState } from "react";

export const useModalAndToast = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => setShowModal(false);

  return {
    showModal,
    setShowModal,
    modalMessage,
    setModalMessage,
    handleCloseModal,
  };
};