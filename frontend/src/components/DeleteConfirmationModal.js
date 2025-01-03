import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, jobTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Delete Job Application
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the job application for{' '}
              <span className="font-medium">{jobTitle}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onConfirm}
                className="btn btn-danger flex-1"
              >
                Delete
              </button>
              <button
                onClick={onCancel}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
