import React from "react";
import "./ConfirmModal.scss";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
