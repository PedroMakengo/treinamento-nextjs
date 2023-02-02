import Head from "next/head";

import style from "../styles/home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>
      <div>
        <h1 className={style.title}>
          Primeiro projeto com <span>NextJS</span>
        </h1>
      </div>
    </>
  );
}
