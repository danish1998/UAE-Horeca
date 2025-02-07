import React from 'react';

const ConfirmationDialog = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <p>{message}</p>
        <button onClick={onConfirm} style={styles.confirmBtn}>Confirm</button>
        <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
      </div>
    </div>
  );
};

// Simple styles for the dialog
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  confirmBtn: {
    margin: '10px',
    padding: '10px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelBtn: {
    margin: '10px',
    padding: '10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default ConfirmationDialog;
