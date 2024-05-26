import { useState, useCallback } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import React from "react";

function useConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});

  const requestConfirmation = useCallback(
    (
      message: string,
      confirmCallback: () => void,
      cancelCallback: () => void
    ) => {
      setMessage(message);
      setOnConfirm(() => () => {
        console.log("confirmado")
        confirmCallback();
        setIsOpen(false);
      });
      setOnCancel(() => () => {
        cancelCallback();
        setIsOpen(false);
      });
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    onCancel();
  }, [onCancel]);

  return {
    requestConfirmation,
    modal: (
      <ConfirmationModal
        isOpen={isOpen}
        message={message}
        onConfirm={onConfirm}
        onCancel={closeModal}
      />
    ),
  };
}

export default useConfirmationModal;
