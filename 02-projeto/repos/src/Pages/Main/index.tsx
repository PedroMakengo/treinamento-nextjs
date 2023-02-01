import React, { useState, useCallback } from "react";

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

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      async function submit() {
        setLoading(true);
        try {
          const response = await api.get(`repos/${newRepo}`);

          const data = {
            name: response.data.full_name,
          };

          setRepositorios([...repositorios, data]);
          setNewRepo("");
        } catch (error) {
          console.log(error);
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
            <a href="/">
              <FaBars size={20} />
            </a>
          </li>
        ))}
      </List>
    </Container>
  );
}
