import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function DeleteModal({show, onHide, onConfirm}) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Tem certeza de que deseja excluir este aluno?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="danger" onClick={onConfirm}>Excluir</Button>
            </Modal.Footer>
        </Modal>
    );
}