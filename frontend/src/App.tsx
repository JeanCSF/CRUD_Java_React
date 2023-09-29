import { useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch';
import axios from 'axios';

import './App.css';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {
  BsPersonPlusFill,
  BsArrowBarUp,
  BsArrowBarDown,
  BsFillGearFill,
  BsFillPencilFill,
  BsTrash3
} from 'react-icons/bs';


import BootstrapPagination from './components/BootstrapPagination';
import BootstrapToast from './components/BootstrapToast';
import DeleteModal from './components/DeleteModal';
import FormModal from './components/FormModal';

interface Aluno {
  ra: number;
  nome: string;
  email: string;
  endereco: string;
  dataNascimento: Date;
  periodo: string;
}

function App() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const fetchResult = useFetch<Aluno[]>('/ServletAluno?cmd=listar');
  useEffect(() => {
    if (fetchResult.data) {
      setAlunos(fetchResult.data);
    }
  }, [fetchResult.data]);
  const isFetching = fetchResult.isFetching;
  const [alunoToEdit, setAlunoToEdit] = useState(null);
  const [alunoToDelete, setAlunoToDelete] = useState<number | null>(null);

  const [filtro, setFiltro] = useState("");
  const filteredAlunos = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    aluno.email.toLowerCase().includes(filtro.toLowerCase()) ||
    aluno.ra.toString().includes(filtro) ||
    aluno.endereco.toLowerCase().includes(filtro.toLowerCase())
  );

  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalPages = filtro ? Math.ceil(filteredAlunos.length / pageSize) : Math.ceil(alunos.length / pageSize);
  const maxVisibleButtons = 1;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const maxWidthForSmallScreen = 768;
  window.addEventListener('resize', () => {
    setWindowWidth(window.innerWidth);
  });
  const isSmallScreen = windowWidth <= maxWidthForSmallScreen;

  const [selectedAluno, setSelectedAluno] = useState(null);
  const handleRowClick = (aluno) => {
    if (isSmallScreen) {
      if (selectedAluno === aluno) {
        setSelectedAluno(null);
      } else {
        setSelectedAluno(aluno);
      }
    }
  };

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

  const [formData, setFormData] = useState({
    txtRa: '',
    txtNome: '',
    txtEmail: '',
    txtEndereco: '',
    txtData: '',
    cmbPeriodo: 'Manhã'
  });

  const handleAlunoAddOrUpdate = (aluno) => {
    const alunoExistente = alunos.find((a) => a.ra === aluno.ra);

    if (alunoExistente) {
      setAlunos((prevAlunos) =>
        prevAlunos.map((a) => (a.ra === aluno.ra ? aluno : a))
      );
    } else {
      setAlunos((prevAlunos) => [...prevAlunos, aluno]);
    }
  };

  useEffect(() => {
    if (alunoToEdit) {
      setFormData({
        txtRa: alunoToEdit.ra,
        txtNome: alunoToEdit.nome,
        txtEmail: alunoToEdit.email,
        txtEndereco: alunoToEdit.endereco,
        txtData: formatDataNascimento(alunoToEdit.dataNascimento),
        cmbPeriodo: alunoToEdit.periodo
      });
    } else {

      setFormData({
        txtRa: '',
        txtNome: '',
        txtEmail: '',
        txtEndereco: '',
        txtData: '',
        cmbPeriodo: 'Manhã',
      });
    }
  }, [alunoToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const {
      txtRa,
      txtNome,
      txtEmail,
      txtEndereco,
      txtData,
      cmbPeriodo,
    } = formData;

    const validationRules = {
      'RA': txtRa,
      'Nome': txtNome,
      'Email': txtEmail,
      'Endereço': txtEndereco,
      'Data de Nascimento': txtData,
      'Período': cmbPeriodo,
    };

    const emptyFields = Object.entries(validationRules)
      .filter(([fieldName, fieldValue]) => !fieldValue)
      .map(([fieldName]) => fieldName);

    if (emptyFields.length > 0) {
      const errorMessage = 'Todos os campos são obrigatórios!';
      setToastMessage(errorMessage);
      setShowToast(true);
      return;
    }

    const params = {
      ra: txtRa,
      nome: txtNome,
      email: txtEmail,
      endereco: txtEndereco,
      dataNascimento: txtData,
      periodo: cmbPeriodo,
    }
    try {
      if (!alunoToEdit) {
        const response = await axios.get(`http://localhost:8081/alunos/ServletAluno?cmd=checkra&ra=${txtRa}`);
        const data = await response.data

        if (data.sucesso == false) {
          setToastMessage(data.message);
          setShowToast(true);
          return;
        }
      }
      const response = await axios.post(
        `http://localhost:8081/alunos/ServletAluno?cmd=${alunoToEdit ? 'atualizar' : 'incluir'
        }`,
        params
      );

      if (response.status !== 200) {
        const errorResponse = response.data;
        throw new Error(`Erro na requisição: ${errorResponse.message}`);
      }

      const responseData = response.data;
      setToastMessage(responseData.message);
      setShowToast(true);
      handleAlunoAddOrUpdate(params);
      setAlunoToEdit(null);
      setShowFormModal(false);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const onPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (ra: number) => {
    setAlunoToDelete(ra);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.post(`http://localhost:8081/alunos/ServletAluno?cmd=excluir&ra=${alunoToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const errorResponse = response.data;
        throw new Error(`Erro na requisição: ${errorResponse.message}`);
      }

      const responseData = response.data;

      setToastMessage(responseData.message);
      setShowToast(true);
      setAlunoToDelete(null);
      setShowModal(false);
      setAlunos((prevAlunos) => prevAlunos.filter((aluno) => aluno.ra !== alunoToDelete));
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setAlunoToEdit(null);
    setFormData({ ...formData })
  }

  return (
    <div className="container-fluid">
      <BootstrapToast
        show={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)} />
      <div className="d-flex justify-content-between align-items-center">
        <h1>Sistema Academico</h1>
        <Button
          onClick={() => setShowFormModal(true)}
          className="border-0 bg-transparent"
          title="Adicionar Aluno">
          <BsPersonPlusFill className="fs-1 text-success" />
        </Button>
      </div>
      <div className="d-flex justify-content-end">
        <Form.Control
          className={isSmallScreen ? 'w-75 mb-2' : 'w-50 mb-2'}
          type="text"
          placeholder="Buscar Registro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>RA</th>
              <th>Nome</th>
              <th className="d-none d-sm-table-cell">Email</th>
              <th className="d-none d-md-table-cell">Endereço</th>
              <th className="d-none d-md-table-cell">Nascimento</th>
              <th className="d-none d-lg-table-cell">Periodo</th>
              <th className="text-center d-none d-lg-table-cell"><BsFillGearFill /></th>
            </tr>
          </thead>
          <tbody>
            {isFetching &&
              <tr key="loading">
                <td colSpan="7">
                  <p className="text-center text-primary fw-bold fs-3">Carregando...</p>
                </td>
              </tr>
            }
            {filtro ? (
              filteredAlunos.slice(startIndex, endIndex).map((aluno) => {
                return (
                  <tr key={aluno.ra}>
                    <td>{aluno.ra}</td>
                    <td>
                      {aluno.nome}
                      {isSmallScreen && (
                        selectedAluno != aluno ?
                          <BsArrowBarDown
                            onClick={() => handleRowClick(aluno)}
                            className="ms-2 text-primary" />
                          :
                          <BsArrowBarUp
                            onClick={() => handleRowClick(aluno)}
                            className="ms-2 text-primary" />
                      )}
                      {selectedAluno === aluno && isSmallScreen && (
                        <div className="aluno-details">
                          <hr />
                          <p>Email: {selectedAluno.email}</p>
                          <p>Endereço: {selectedAluno.endereco}</p>
                          <p>Nascimento: {selectedAluno.dataNascimento}</p>
                          <p>Periodo: {selectedAluno.periodo}</p>
                          <hr />
                          <p className="d-flex justify-content-between">
                            <Button
                              onClick={() => {
                                setAlunoToEdit(aluno);
                                setShowFormModal(true);
                                setFormData(aluno)
                              }}
                              className="border-0 bg-transparent text-primary"><BsFillPencilFill /></Button>
                            <Button
                              onClick={() => handleDeleteClick(selectedAluno.ra)}
                              className="border-0 bg-transparent text-danger"><BsTrash3 /></Button>
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="d-none d-sm-table-cell">{aluno.email}</td>
                    <td className="d-none d-md-table-cell nowrap">{aluno.endereco}</td>
                    <td className="d-none d-md-table-cell nowrap">{aluno.dataNascimento}</td>
                    <td className="d-none d-lg-table-cell">{aluno.periodo}</td>
                    <td className="text-center d-none d-lg-table-cell">
                      <Button
                        onClick={() => {
                          setAlunoToEdit(aluno);
                          setShowFormModal(true);
                        }}
                        className="border-0 bg-transparent text-primary"><BsFillPencilFill /></Button>
                      <Button
                        onClick={() => handleDeleteClick(aluno.ra)}
                        className="border-0 bg-transparent text-danger"><BsTrash3 /></Button>
                    </td>
                  </tr>
                )
              })
            ) : (
              alunos?.slice(startIndex, endIndex).map(aluno => {
                return (
                  <tr key={aluno.ra}>
                    <td>{aluno.ra}</td>
                    <td>
                      {aluno.nome}
                      {isSmallScreen && (
                        selectedAluno != aluno ?
                          <BsArrowBarDown
                            onClick={() => handleRowClick(aluno)}
                            className="ms-2 text-primary" />
                          :
                          <BsArrowBarUp
                            onClick={() => handleRowClick(aluno)}
                            className="ms-2 text-primary" />
                      )}
                      {selectedAluno === aluno && isSmallScreen && (
                        <div className="aluno-details">
                          <hr />
                          <p>Email: {selectedAluno.email}</p>
                          <p>Endereço: {selectedAluno.endereco}</p>
                          <p>Nascimento: {selectedAluno.dataNascimento}</p>
                          <p>Periodo: {selectedAluno.periodo}</p>
                          <hr />
                          <p className="d-flex justify-content-between">
                            <Button
                              onClick={() => {
                                setAlunoToEdit(aluno);
                                setShowFormModal(true);
                                setFormData(aluno)
                              }}
                              className="border-0 bg-transparent text-primary"><BsFillPencilFill /></Button>
                            <Button
                              onClick={() => handleDeleteClick(selectedAluno.ra)}
                              className="border-0 bg-transparent text-danger"><BsTrash3 /></Button>
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="d-none d-sm-table-cell">{aluno.email}</td>
                    <td className="d-none d-md-table-cell nowrap">{aluno.endereco}</td>
                    <td className="d-none d-md-table-cell nowrap">{aluno.dataNascimento}</td>
                    <td className="d-none d-lg-table-cell">{aluno.periodo}</td>
                    <td className="text-center d-none d-lg-table-cell">
                      <Button
                        onClick={() => {
                          setAlunoToEdit(aluno);
                          setShowFormModal(true);
                        }}
                        className="border-0 bg-transparent text-primary"><BsFillPencilFill /></Button>
                      <Button
                        onClick={() => handleDeleteClick(aluno.ra)}
                        className="border-0 bg-transparent text-danger"><BsTrash3 /></Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>
      </div>
      <BootstrapPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        maxVisibleButtons={maxVisibleButtons}
      />
      <DeleteModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
      <FormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        alunoToEdit={alunoToEdit}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
      />
    </div>
  )
}

export default App
