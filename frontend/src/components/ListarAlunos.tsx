import React, { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import DataTable, { IDataTableColumn } from "react-data-table-component";

interface Aluno {
    ra: number;
    nome: string;
    email: string;
    endereco: string;
    dataNascimento: Date;
    periodo: string;
}

export default function ListarAlunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        fetch("http://localhost:8081/alunosdb/alunos")
            .then((response) => response.json())
            .then((data) => {
                setAlunos(data);
            });
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilterText(value);
    };

    const filteredData = alunos.filter((item) => {
        const lowerCaseFilterText = filterText.toLowerCase();

        return (
            item.nome.toLowerCase().includes(lowerCaseFilterText) ||
            item.ra.toString().includes(filterText) ||
            item.email.toLowerCase().includes(lowerCaseFilterText) ||
            item.endereco.toLowerCase().includes(lowerCaseFilterText)
        );
    });
    const columns: IDataTableColumn<Aluno>[] = [
        {
            name: "RA",
            selector: (row: Aluno) => row.ra.toString(),
            sortable: true,
        },
        {
            name: "Nome",
            selector: (row: Aluno) => row.nome,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row: Aluno) => row.email,
            sortable: true,
        },
        {
            name: "Endereço",
            selector: (row: Aluno) => row.endereco,
            sortable: true,
        },
        {
            name: "Nascimento",
            selector: (row: Aluno) => row.dataNascimento.toString(),
            sortable: true,
        },
        {
            name: "Periodo",
            selector: (row: Aluno) => row.periodo,
            sortable: true,
        },
        {
            name: "Ações",
            cell: (row: Aluno) => (
                <div>
                    <FaPen className="me-2 text-primary" onClick={() => handleEdit(row)} />
                    <FaTrash className="text-danger" onClick={() => handleDelete(row)} />
                </div>
            ),
            allowOverflow: true,
            button: true,
        },
    ];

    const handleEdit = (aluno: Aluno) => {
        // Implemente a lógica de edição aqui
        console.log(`Editar aluno ${aluno.nome}`);
    };

    const handleDelete = (aluno: Aluno) => {
        // Certifique-se de confirmar a exclusão com o usuário antes de continuar
        const confirmDelete = window.confirm(`Tem certeza de que deseja excluir o aluno ${aluno.nome}?`);

        if (confirmDelete) {
            // Faça a solicitação DELETE para o servlet
            fetch(`http://localhost:8081/alunosdb/ServletAluno?cmd=excluir&ra=${aluno.ra}`, {
                method: "POST",
            })
                .then((response) => {
                    if (response.ok) {
                        // Atualize o estado para refletir a exclusão do aluno
                        setAlunos((prevAlunos) => prevAlunos.filter((a) => a.ra !== aluno.ra));
                        alert(`Aluno ${aluno.nome} excluído com sucesso!`);
                    } else {
                        alert("Ocorreu um erro ao excluir o aluno.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao excluir aluno:", error);
                    alert("Ocorreu um erro ao excluir o aluno.");
                });
        }
    };
    return (
        <div>
            <input
                type="text"
                placeholder="Filtrar alunos..."
                value={filterText}
                onChange={handleFilterChange}
            />
            <DataTable columns={columns} data={filteredData} pagination />
        </div>
    );
}