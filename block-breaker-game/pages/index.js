import Head from 'next/head';
import BlockBreaker from '../components/BlockBreaker';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Block Breaker Game</title>
        <meta name="description" content="Block Breaker Game created with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <BlockBreaker />
      </main>
    </div>
  );
}

