import React, { useState, useEffect } from "react";
import { Container, Loading, IssuesList } from "./style";

import { FaArrowLeft } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";

import api from "../../services/api";

export default function Repositorio() {
  let { repositorio } = useParams();

  const [repo, setRepo] = useState<any>({});
  const [issues, setIssues] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const nomeRepo = repositorio;

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
    </Container>
  );
}
