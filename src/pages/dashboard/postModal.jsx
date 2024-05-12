// PostModal.js
import React from 'react';
import Modal from 'react-bootstrap/Modal';

function PostModal({ user, handleClose }) {
  return (
    <Modal show={user !== null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Hello</h1>
      </Modal.Body>
    </Modal>
  );
}

export default PostModal;
