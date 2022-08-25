import Layout from '@/components/Layout'
import Asset from '@/components/Asset'
import algosdk from "algosdk";
import styles from "@/styles/MasterAccount.module.css";
import { waitForConfirmation } from "@/helpers/utils";

export default function MasterAccountPage ({accountInfo}) {
//   console.log(accountInfo);
  const amount  = parseFloat((accountInfo.amount/10**6).toFixed(6)) 
  return (
    <Layout>
      <h1 className="text-center">Master Account Page</h1>
      <div>
        <div>
          <p>Account Address : 
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://testnet.algoexplorer.io/address/${accountInfo.address}`}
          >
            {accountInfo.address}
          </a>
          </p>
          <p>Account Balance : {amount} Algo</p>
        </div>

        <div className={styles.asset_container}>
            <h3 className="text-center">Asset Detail</h3>
          <ul>
            {
              accountInfo["created-assets"] && accountInfo["created-assets"].map((ast) => (
                <><li><Asset key={ast.index} asset={ast} /></li></>
              ))
            }
    </ul>
        </div>
      </div>

      </Layout>
  )
}


export async function getServerSideProps(){
  const baseServer = process.env.ALGO_SERVER_;
  const port = "";
  const token = {
    "X-API-Key": process.env.ALGO_TOKEN_,
  };
  const master_account = algosdk.mnemonicToSecretKey(process.env.ALGO_FAUCET_PASSPHRASE_)
  // console.log(master_account.addr)
  const algodClient = new algosdk.Algodv2(token, baseServer, port);
  let accountInfo = await algodClient.accountInformation(master_account.addr).do();
  return {
    props:{accountInfo}
  }
}
