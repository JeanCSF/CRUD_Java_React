import { useState, useEffect } from "react";
import Toast from 'react-bootstrap/Toast';

export default function BootstrapToast({ show, message, onClose }) {
    const [showToast, setShowToast] = useState(show);

    useEffect(() => {
        setShowToast(show);
    }, [show]);

    return (
        <Toast show={showToast} onClose={onClose} delay={3000} autohide className="position-absolute top-start" style={{zIndex: 9999}}>
            <Toast.Header>
                <strong className="me-auto">Sistema Academico</strong>
                <small>agora</small>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
        </Toast>
    );
}