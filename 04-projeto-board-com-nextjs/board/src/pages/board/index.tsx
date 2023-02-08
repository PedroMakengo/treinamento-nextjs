import { useState, FormEvent } from "react";
import Head from "next/head";

import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

import styles from "./style.module.scss";

import {
  FiPlus,
  FiCalendar,
  FiEdit2,
  FiTrash,
  FiClock,
  FiX,
} from "react-icons/fi";
import { SupportButton } from "../../components/SupportButton";
import { format } from "date-fns";

import firebase from "../../services/firebaseConnection";

type TaskList = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  nome: string;
};

interface BoardProps {
  user: {
    id: string;
    name: string;
  };
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState("");
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if (input === "") {
      alert("Preencha alguma tarefa!");
      return;
    }

    if (taskEdit) {
      await firebase
        .firestore()
        .collection("tarefas")
        .doc(taskEdit.id)
        .update({
          tarefa: input,
        })
        .then(() => {
          let data = taskList;
          let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
          data[taskIndex].tarefa = input;

          setTaskList(data);
          setTaskEdit(null);
          setInput("");
        });

      return;
    }

    await firebase
      .firestore()
      .collection("tarefas")
      .add({
        created: new Date(),
        tarefa: input,
        userId: user.id,
        nome: user.name,
      })
      .then(doc => {
        console.log("Cadastrado com sucesso!");
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), "dd MMMM yyyy"),
          tarefa: input,
          userId: user.id,
          nome: user.name,
        };
        setTaskList(state => [...state, data]);
        setInput("");
      })
      .catch(error => {
        console.log("Erro ao cadastrar", error);
      });
  }

  // Delete my task
  async function handleDelete(id: string) {
    await firebase
      .firestore()
      .collection("tarefas")
      .doc(id)
      .delete()
      .then(() => {
        let taskDeleted = taskList.filter(item => {
          return item.id !== id;
        });
        setTaskList(taskDeleted);
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Edit task
  function handleEdit(task: TaskList) {
    setTaskEdit(task);
    setInput(task.tarefa);
  }

  // Cancel
  function handleCancelEdit() {
    setInput("");
    setTaskEdit(null);
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color="#ff3636" />
            </button>
            Você está editando uma tarefa
          </span>
        )}
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite a sua tarefa..."
          />
          <button type="submit">
            <FiPlus size={25} color="#17181F" />
          </button>
        </form>

        <h1>
          Você tem {taskList.length}
          {taskList.length === 1 ? " Tarefa" : " tarefas!"}
        </h1>

        <section>
          {taskList.map(task => (
            <article className={styles.taskList} key={task.id}>
              <Link href={`/board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#FFB800" />
                    <time>{task.createdFormated}</time>
                  </div>
                  <button onClick={() => handleEdit(task)}>
                    <FiEdit2 size={20} color="#fff" />
                    <span>Editar</span>
                  </button>
                </div>
                <button onClick={() => handleDelete(task.id)}>
                  <FiTrash size={20} color="#FF3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Obrigado po apoiar esse projeto.</h3>
        <div>
          <FiClock size={28} color="#fff" />
          <time>Última doação foi a 3 dias.</time>
        </div>
      </div>

      <SupportButton />
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Get my task from firebase
  const tasks = await firebase
    .firestore()
    .collection("tarefas")
    .orderBy("created", "asc")
    .where("userId", "==", session?.user.email)
    .get();

  //
  const data = JSON.stringify(
    tasks.docs.map(u => {
      return {
        id: u.id,
        createdFormated: format(u.data().created.toDate(), "dd MMMM yyyy"),
        ...u.data(),
      };
    })
  );

  const user = {
    name: session?.user.name,
    id: session?.user.email,
  };

  return {
    props: { user, data },
  };
}
