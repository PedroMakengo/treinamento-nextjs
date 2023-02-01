import React, { useState, useCallback, useEffect } from "react";

import { Link } from "react-router-dom";

import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";

import { Container, Form, SubmitButton, List } from "./style";

import api from "../../services/api";

interface Repository {
  name: string;
}

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  // Buscar;
  useEffect(() => {
    const repoStorage = localStorage.getItem("repos");

    if (repoStorage) {
      return setRepositorios(JSON.parse(repoStorage));
    }
  }, []);

  // Salvar alterações
  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(repositorios));
  }, [repositorios]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      async function submit() {
        setLoading(true);
        setAlert(false);
        try {
          if (newRepo === "") {
            throw new Error("Você precisa indicar um repositório");
          }
          const response = await api.get(`repos/${newRepo}`);

          const hasRepo = repositorios.find(repo => repo.name === newRepo);

          if (hasRepo) {
            throw new Error("Repositório Duplicado");
          }

          const data = {
            name: response.data.full_name,
          };

          setRepositorios([...repositorios, data]);
          setNewRepo("");
        } catch (error) {
          console.log(error);
          setAlert(true);
        } finally {
          setLoading(false);
        }
      }
      submit();
    },
    [newRepo, repositorios]
  );

  const handleDelete = useCallback(
    (repo: any) => {
      const find = repositorios.filter(r => r.name !== repo);

      setRepositorios(find);
    },
    [repositorios]
  );

  return (
    <Container>
      <h1>
        <FaGithub size="25" />
        Meus repositórios
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Adicionar repositórios"
        />

        <SubmitButton>
          {loading ? (
            <FaSpinner color="#fff" size="14" />
          ) : (
            <FaPlus color="#fff" size="14" />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositorios.map(repo => (
          <li key={repo.name}>
            <span>
              <button onClick={() => handleDelete(repo.name)}>
                <FaTrash size="14" />
              </button>
              {repo.name}
            </span>
            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
