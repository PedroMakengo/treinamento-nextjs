import Head from "next/head";

import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import firebase from "../../services/firebaseConnection";
import { format } from "date-fns";

type Task = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  nome: string;
};

interface TaskListProps {
  data: string;
}

export default function Task({ data }: TaskListProps) {
  const task = JSON.parse(data) as Task;

  return (
    <>
      <Head>
        <title>Detalhes da sua tarefa</title>
      </Head>
      <article>
        <div>
          <div>
            <h1>Página detalhes</h1>
            <h2>{task.tarefa}</h2>
          </div>
        </div>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const { id } = params;

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/board",
        permanent: false,
      },
    };
  }

  const data = await firebase
    .firestore()
    .collection("tarefas")
    .doc(String(id))
    .get()
    .then(spanshot => {
      const data = {
        id: spanshot.id,
        created: spanshot.data().created,
        createdFormated: format(
          spanshot.data().created.toDate(),
          "dd MMMM yyyy"
        ),
        tarefa: spanshot.data().tarefa,
        userId: spanshot.data().userId,
        nome: spanshot.data().nome,
      };

      return JSON.stringify(data);
    });

  return {
    props: {
      data,
    },
  };
};
