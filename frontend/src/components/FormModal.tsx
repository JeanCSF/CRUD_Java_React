import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-bootstrap/Select';

export default function FormModal({ show, onHide, alunoToEdit, handleSubmit, handleChange, formData }) {

    const formatDataNascimento = (dateString) => {
        const months = {
            jan: '01',
            fev: '02',
            mar: '03',
            abr: '04',
            mai: '05',
            jun: '06',
            jul: '07',
            ago: '08',
            set: '09',
            out: '10',
            nov: '11',
            dez: '12',
        };

        const parts = dateString.match(/(\w+)\.\s(\d+),\s(\d+)/);
        if (parts) {
            const [, month, day, year] = parts;
            const formattedDate = `${year}-${months[month.toLowerCase()]}-${day.padStart(2, '0')}`;
            return formattedDate;
        }

        return dateString;
    };

    return (
        <Modal
            show={show}
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
                                value={alunoToEdit ? alunoToEdit.nome : formData.txtNome}
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
                                value={alunoToEdit ? alunoToEdit.email : formData.txtEmail}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} sm={8} controlId="txtEndereco">
                            <Form.Label>Endereço:</Form.Label>
                            <Form.Control
                                type="text"
                                name="txtEndereco"
                                value={alunoToEdit ? alunoToEdit.endereco : formData.txtEndereco}
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
                                value={alunoToEdit ? formatDataNascimento(alunoToEdit.dataNascimento) : formData.txtData}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={6} sm={8} controlId="cmbPeriodo">
                            <Form.Label>Período:</Form.Label>
                            <Form.Select
                                name="cmbPeriodo"
                                value={alunoToEdit ? alunoToEdit.periodo : formData.cmbPeriodo}
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