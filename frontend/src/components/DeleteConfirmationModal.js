import React from 'react';

function DeleteConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="delete-confirmation-modal">
      <div className="modal-content">
        <p>Are you sure you want to delete this job?</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
