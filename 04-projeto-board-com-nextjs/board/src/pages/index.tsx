import Image from "next/image";

import { useState } from "react";

import Head from "next/head";

import { GetStaticProps } from "next";

import styles from "../styles/home.module.scss";

import firebase from "../services/firebaseConnection";

import boarUser from "../../public/images/board-user.svg";

type Data = {
  id: string;
  donate: string;
  lastDonate: Date;
  image: string;
};

interface HomeProps {
  data: string;
}

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data));
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>
      <main className={styles.container}>
        <Image src={boarUser} alt="Ferramenta board" />

        <section className={styles.callToAction}>
          <h1>
            Uma ferramenta para seu dia a dia Escreva, planeje e organize-se...
          </h1>
          <p>
            <span>100% Gratuita</span> e online.
          </p>
        </section>

        {donaters.length !== 0 && <h3>Apoiadores:</h3>}
        <div className={styles.donaters}>
          {donaters.map(item => (
            <Image
              width={65}
              height={65}
              src={item.image}
              alt={item.id}
              key={item.id}
            />
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const donaters = await firebase.firestore().collection("users").get();

  const data = JSON.stringify(
    donaters.docs.map(u => {
      return {
        id: u.id,
        ...u.data(),
      };
    })
  );
  return {
    props: { data },
    revalidate: 60 * 60,
  };
};
