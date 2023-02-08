import { getServerSession } from "next-auth";
import Head from "next/head";
import { authOptions } from "../api/auth/[...nextauth]";

import styles from "./styles.module.scss";

interface DonateProps {
  user: {
    id: string;
    nome: string;
    image: string;
  };
}
export default function Donate({ user }: DonateProps) {
  return (
    <>
      <Head>
        <title>Página de apoio</title>
      </Head>
      <main className={styles.container}>
        <img src="/images/rocket.svg" alt="Seja apoiador" />

        <div className={styles.vip}>
          <img src={user.image} alt={user.nome} />
          <span>Parabéns você é um novo apoiador</span>
        </div>

        <h1>Seja um apoiador deste projeto 🏆</h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>
          Apareça na nossa home, tenha funcionalidades exclusivas.
        </strong>
      </main>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanente: false,
      },
    };
  }

  const user = {
    nome: session?.user.name,
    id: session?.user.email,
    image: session?.user.image,
  };

  return {
    props: { user },
  };
}
