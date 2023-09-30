import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
interface DeleteModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
}

export default function DeleteModal(props: DeleteModalProps) {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Tem certeza de que deseja excluir este aluno?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Cancelar</Button>
                <Button variant="danger" onClick={props.onConfirm}>Excluir</Button>
            </Modal.Footer>
        </Modal>
    );
}