import Link from 'next/link'
import styles from '@/styles/Header.module.css'

export default function Header() {

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/'>
          <a>Home</a>
        </Link>
      </div>


      <nav>
        <ul>
          <li>
            <Link href='/'>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href='/algorand'>
              <a>Algorand</a>
            </Link>
          </li>
          <li>
            <Link href='/algorand/account/master'>
              <a>Master Account</a>
            </Link>
          </li>
          <li>
            <Link href='/algorand/asa'>
              <a>ASA</a>
            </Link>
          </li>
          
        </ul>
      </nav>
    </header>
  )
}
