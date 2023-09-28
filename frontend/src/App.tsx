import { useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch';
import axios from 'axios';

import './App.css';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
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

  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalPages = Math.ceil(alunos.length / pageSize);
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

  const [formData, setFormaData] = useState({
    txtRa: '',
    txtNome: '',
    txtEmail: '',
    txtEndereco: '',
    txtData: '',
    cmbPeriodo: 'Manhã'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormaData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/alunos/ServletAluno?cmd=${alunoToEdit ? 'atualizar' : 'incluir'
        }`,
        formData
      );

      if (response.status !== 200) {
        const errorResponse = response.data;
        throw new Error(`Erro na requisição: ${errorResponse.message}`);
      }

      const responseData = response.data;
      setToastMessage(responseData.message);
      setShowToast(true);
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
    setFormaData({ ...formData })
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
            {alunos?.slice(startIndex, endIndex).map(aluno => {
              return (
                <tr key={aluno.ra}>
                  <td>{aluno.ra}</td>
                  <td className="nowrap">
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
                              setFormaData(aluno)
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
            })}
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
