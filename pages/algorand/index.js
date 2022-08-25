import Layout from '@/components/Layout'
import Link from 'next/link'

export default function ALgorandPage() {
  return (
    <Layout>
      <h1 className="text-center">Algorand Page</h1>

      <div>
      <ul>
        <li>
          <Link href='/algorand/asa'>
            <a>Create ASA</a>
          </Link>
        </li>
        <li>
          <Link href='/algorand/master_account' >
            <a>Master Account Info</a>
          </Link>
        </li>
      </ul>
        
      </div>


    </Layout>
  )
}
