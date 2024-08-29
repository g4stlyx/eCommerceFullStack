import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useModalAndToast } from './useModalAndToast';

const LoginModal : React.FC = () => {
    const {
        showModal,
        setShowModal,
        modalMessage,
      } = useModalAndToast();
    const navigate = useNavigate();

    return(
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Üye Olmanız Gerekiyor.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{modalMessage}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Kapat
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Giriş Yap
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Üye Ol
              </Button>
            </Modal.Footer>
          </Modal>
    )
}

export default LoginModal