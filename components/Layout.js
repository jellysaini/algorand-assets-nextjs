import Head from "next/head"
import { useRouter } from 'next/router'
import Header from './Header'
import styles from '@/styles/Layout.module.css'
export default function Layout({ title, keywords, description, children }) {
    const router = useRouter()

  return (
    <>
    <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords}/>
    </Head>
    <Header />
    <div className={styles.container}>{children}</div>
    </>
  )
}

Layout.defaultProps = {
  title: 'Algorand Home Page',
  description: 'Algorand using nextjs',
  keywords: 'algorand, algosdk',
}