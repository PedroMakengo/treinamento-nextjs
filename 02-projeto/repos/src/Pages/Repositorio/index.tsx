import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { Container } from "./style";

import api from "../../services/api";

export default function Repositorio() {
  let { repositorio } = useParams();

  const [repo, setRepo] = useState({});
  const [issues, setIssues] = useState([]);
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

      console.log(repositorioData.data);
      console.log(issuesData.data);

      setRepo(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    load();
  }, [repositorio]);

  return <Container>{repositorio}</Container>;
}
