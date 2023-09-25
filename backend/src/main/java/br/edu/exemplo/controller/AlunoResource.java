package br.edu.exemplo.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

import br.edu.exemplo.dao.AlunoDAO;
import br.edu.exemplo.model.Aluno;

import java.util.List;

@WebServlet("/alunos")
public class API_Alunos extends HttpServlet {
    private AlunoDAO dao;
    private Gson gson = new Gson();

    @Override
    public void init() throws ServletException {
        try {
            dao = new AlunoDAO();
        } catch (Exception e) {
            throw new ServletException("Erro ao inicializar o servlet", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            List<Aluno> alunos = dao.todosAlunos();
            String alunosJson = gson.toJson(alunos);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(alunosJson);
        } catch (Exception e) {
            // Trata a exceção retornando um status HTTP 500 e uma mensagem de erro em JSON
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String errorJson = gson.toJson(new ErrorMessage("Erro ao buscar alunos: " + e.getMessage()));
            response.getWriter().write(errorJson);
        }
    }

    // Classe para representar uma mensagem de erro em JSON
    private static class ErrorMessage {
        private String message;

        public ErrorMessage(String message) {
            this.message = message;
        }
    }
}
