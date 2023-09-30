import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Aluno } from '../App';

import { FormData } from '../App';


interface FormModalProps {
    show: boolean;
    onHide: () => void;
    alunoToEdit: Aluno | null;
    handleSubmit: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    formData: FormData;
}

export default function FormModal(props: FormModalProps) {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.alunoToEdit ? 'Editar Aluno' : 'Incluir Aluno'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={props.handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} lg={4} sm={3} controlId="txtRa">
                            <Form.Label>RA:</Form.Label>
                            <Form.Control
                                type="number"
                                name="txtRa"
                                value={props.formData.txtRa}
                                onChange={props.handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} sm={8} controlId="txtNome">
                            <Form.Label>Nome:</Form.Label>
                            <Form.Control
                                type="text"
                                name="txtNome"
                                value={props.formData.txtNome}
                                onChange={props.handleChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} lg={4} sm={3} controlId="txtEmail">
                            <Form.Label>E-mail:</Form.Label>
                            <Form.Control
                                type="email"
                                name="txtEmail"
                                value={props.formData.txtEmail}
                                onChange={props.handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} sm={8} controlId="txtEndereco">
                            <Form.Label>Endereço:</Form.Label>
                            <Form.Control
                                type="text"
                                name="txtEndereco"
                                value={props.formData.txtEndereco}
                                onChange={props.handleChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} lg={4} sm={3} controlId="txtData">
                            <Form.Label>Data de Nascimento:</Form.Label>
                            <Form.Control
                                type="date"
                                name="txtData"
                                value={props.formData.txtData}
                                onChange={props.handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} sm={8} controlId="cmbPeriodo">
                            <Form.Label>Período:</Form.Label>
                            <Form.Select
                                name="cmbPeriodo"
                                value={props.formData.cmbPeriodo}
                                onChange={props.handleSelectChange}
                            >
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noite">Noite</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Cancelar</Button>
                <Button variant="primary" onClick={props.handleSubmit}>Salvar</Button>
            </Modal.Footer>
        </Modal>
    );
}