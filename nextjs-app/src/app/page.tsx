import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Next.js + Docker + Nginx</h1>
      <div className={styles.card}>
        <p>Это статический экспорт, работающий через Nginx в Docker</p>
      </div>
    </main>
  )
}
