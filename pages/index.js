import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '@/components/Layout'
import Link from 'next/link'


export default function HomePage() {
  return (
    <Layout title="Home" >
      <h1 className="text-center">Home page</h1>
      <div className='mt-30'>
      <ul className={styles.grid}>
        <li >
          <Link href='/algorand/asa' >
            <a className={styles.card}>Create ASA</a>
          </Link>
        </li>
        <li >
          <Link href='/algorand/asa/transfer' >
            <a className={styles.card}>Transfer ASA</a>
          </Link>
        </li>
        <li>
          <Link href='/algorand/account/master' >
            <a className={styles.card}>Master Account Info</a>
          </Link>
        </li>
      </ul>
      </div>
    </Layout>
    
  )
}
