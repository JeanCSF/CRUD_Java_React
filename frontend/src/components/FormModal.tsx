import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-bootstrap/Select';

export default function FormModal({ show, onHide, alunoToEdit, handleSubmit, handleChange, formData }) {

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {alunoToEdit ? 'Editar Aluno' : 'Incluir Aluno'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} lg={4} sm={3} controlId="txtRa">
                            <Form.Label>RA:</Form.Label>
                            <Form.Control
                                type="text"
                                name="txtRa"
                                value={formData.txtRa}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} sm={8} controlId="txtNome">
                            <Form.Label>Nome:</Form.Label>
                            <Form.Control
                                type="text"
                                name="txtNome"
                                value={formData.txtNome}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} lg={4} sm={3} controlId="txtEmail">
                            <Form.Label>E-mail:</Form.Label>
                            <Form.Control
                                type="email"
                                name="txtEmail"
                                value={formData.txtEmail}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} sm={8} controlId="txtEndereco">
                            <Form.Label>Endereço:</Form.Label>
                            <Form.Control
                                type="text"
                                name="txtEndereco"
                                value={formData.txtEndereco}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} lg={4} sm={3} controlId="txtData">
                            <Form.Label>Data de Nascimento:</Form.Label>
                            <Form.Control
                                type="date"
                                name="txtData"
                                value={formData.txtData}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} sm={8} controlId="cmbPeriodo">
                            <Form.Label>Período:</Form.Label>
                            <Form.Select
                                name="cmbPeriodo"
                                value={formData.cmbPeriodo}
                                onChange={handleChange}
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
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
            </Modal.Footer>
        </Modal>
    );
}