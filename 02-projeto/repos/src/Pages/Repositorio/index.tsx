import React, { useState, useEffect } from "react";
import {
  Container,
  Loading,
  IssuesList,
  PageActions,
  FilterList,
} from "./style";

import { FaArrowLeft } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";

import api from "../../services/api";

export default function Repositorio() {
  let { repositorio } = useParams();

  const [repo, setRepo] = useState<any>({});
  const [issues, setIssues] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState([
    { state: "all", label: "Todas", active: true },
    { state: "open", label: "Abertas", active: false },
    { state: "closed", label: "Fechadas", active: false },
  ]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const nomeRepo = repositorio;

      let active = filters.find((f: any) => f.active);

      // console.log(active.state);

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: "open",
            per_page: 5,
          },
        }),
      ]);

      console.log(repositorioData.data.owner);
      console.log(issuesData.data);

      setRepo(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    load();
  }, [repositorio]);

  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = repositorio;

      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: "open",
          page,
          per_page: 5,
        },
      });

      setIssues(response.data);
    }
    loadIssue();
  }, [repositorio, page]);

  function handlePage(action: any) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }
  return (
    <Container>
      <Link to="/">
        <FaArrowLeft size={30} color="#000" />
      </Link>
      <div className="header">
        <img src={repo.owner.avatar_url} alt={repo.owner.login} />
        <h1>{repo.name}</h1>
        <p>{repo.description}</p>
      </div>

      <IssuesList>
        <FilterList>
          {filters.map((filter, index) => (
            <button type="button" key={filter.label} onClick={() => {}}>
              {filter.label}
            </button>
          ))}
        </FilterList>

        {issues.map((issue: any) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map((label: any) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={() => handlePage("back")}
          disabled={page < 2}
        >
          Anterior
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Proxima
        </button>
      </PageActions>
    </Container>
  );
}
