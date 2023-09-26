import { useState } from 'react';
import { useFetch } from './hooks/useFetch';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BsFillGearFill, BsFillPencilFill, BsTrash3 } from 'react-icons/bs';

import axios from 'axios';

import BootstrapPagination from './components/BootstrapPagination';
import BootstrapToast from './components/BootstrapToast';
import DeleteModal from './components/DeleteModal';

interface Aluno {
  ra: number;
  nome: string;
  email: string;
  endereco: string;
  dataNascimento: Date;
  periodo: string;
}

function App() {
  const fetchResult = useFetch<Aluno[]>('/ServletAluno?cmd=listar');
  const alunos = fetchResult.data || [];
  const isFetching = fetchResult.isFetching;
  const [alunoToDelete, setAlunoToDelete] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalPages = Math.ceil(alunos.length / pageSize);
  const maxVisibleButtons = 1;

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
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="d-flex justify-content-between align-items-center flex-column">
      <BootstrapToast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
      <h1>Sistema Academico</h1>
      <div className="row w-75">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>RA</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Endereço</th>
              <th>Nascimento</th>
              <th>Periodo</th>
              <th className="text-center"><BsFillGearFill /></th>
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
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.endereco}</td>
                  <td>{aluno.dataNascimento}</td>
                  <td>{aluno.periodo}</td>
                  <td className="d-flex justify-content-evenly">
                    <Button className="border-0 bg-transparent text-primary"><BsFillPencilFill /></Button>
                    <Button onClick={() => handleDeleteClick(aluno.ra)} className="border-0 bg-transparent text-danger"><BsTrash3 /></Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
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
      </div>
    </div>
  )
}

export default App
