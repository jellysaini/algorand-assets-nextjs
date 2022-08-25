import Layout from "@/components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import styles from "@/styles/Form.module.css";
// import { ALGO_FAUCET_ACCOUNT_ADDRESS_, PER_PAGE_ } from '@/config/index'
import algosdk from "algosdk";
import { waitForConfirmation } from "@/helpers/utils";

export default function ASATransferPage({accountInfo}) {
  const master_account = algosdk.mnemonicToSecretKey(
    process.env.ALGO_FAUCET_PASSPHRASE_
  );
  //   console.log(master_account.addr);

  const test_account = algosdk.mnemonicToSecretKey(
    process.env.ALGO_TEST_ACCOUNT_PASSPHRASE_
  );

  const account_array = [
    {
      name: "Master Account",
      address: master_account.addr,
    },
    {
      name: "Test Account",
      address: test_account.addr,
    },
    
  ];

  const asset_array = [
    {
      name: "Algorand Asset New",
      index: 94701156,
    },
    {
      name: "Algorand Asset",
      index: 96230975,
    },
    {
      name: "authdemo",
      index: 102562258,
    },
    {
      name: "Algorand Asset Z",
      index: 104137016,
    },
    {
      name: "Algorand Asset Nextjs",
      index: 106278006,
    },
    {
      name: "Algorand Asset n",
      index: 106279221,
    },
  ];
  const baseServer = process.env.ALGO_SERVER_;
  const port = "";
  const token = {
    "X-API-Key": process.env.ALGO_TOKEN_,
  };

  // const accountInfo = async () => await algodClient.accountInformation(address).do();
  // console.log(accountInfo);

  const [values, setValues] = useState({
    account: account_array[0].address,
    asset: asset_array[0].index,
    amount: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleSubmit = async (e) => {
    toast.info("Transfer ASA Start");
    e.preventDefault();

    if (values.account === master_account.addr) {
      toast.error("No use of transfering to master account ");
      return;
    }
    const algodClient = new algosdk.Algodv2(token, baseServer, port);

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      const accountInfo = await algodClient
        .accountInformation(values.account)
        .do();
      const holding = accountInfo.assets.find(
        (ast) => ast["asset-id"] == values.asset
      );

      console.log(accountInfo);
      console.log(
        `is holding asset ${values.asset} ${Boolean(holding)}, ${holding}`
      );
    //   toast.info(`is holding asset ${values.asset} ${Boolean(holding)}`);
    let ac_name
    const f_ac_name = account_array.find(a=>a.address === values.account)
    ac_name = f_ac_name?.name || ""
      if (!holding) {
        toast.info(`${ac_name} not holding asset ${values.asset} ${Boolean(holding)}`);
        if (values.account === test_account.addr) {
          toast.info("OPTIN the test account");

          try {
            const assetId = parseInt(values.asset); // Note: change the asset ID if it was different for your new asset

            const sender = test_account.addr;
            const recipient = sender; // transaction to yourself

            // We set revocationTarget to undefined as this is not a clawback operation
            const revocationTarget = undefined;

            // CloseReaminerTo is set to undefined as we are not closing out an asset
            const closeRemainderTo = undefined;

            const amount = 0;
            const optinTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
              sender,
              recipient,
              closeRemainderTo,
              revocationTarget,
              amount,
              undefined,
              assetId,
              suggestedParams
            );

            const rawSignedTxn = optinTxn.signTxn(test_account.sk);
            const txId = optinTxn.txID().toString();
            console.log("Signed transaction with txID: %s", txId);

            // Submit the transaction
            await algodClient.sendRawTransaction(rawSignedTxn).do();

            // Wait for confirmation
            const confirmedTxn = await waitForConfirmation(
              algodClient,
              txId,
              4
            );

            // Get the completed transaction
            console.log(
              "Transaction " +
                txId +
                " confirmed in round " +
                confirmedTxn["confirmed-round"]
            );
            toast.success(` asset ${values.asset} optin success`);
            // Check if the new asset pops up in "account2"
            // const accountInfo = await algodClient.accountInformation(account2.addr).do();
            // console.log(accountInfo);
          } catch (error) {
            console.log("err", error);
            toast.error(error.message);
          }
        }

        // const sender = test_account.addr;
        // const recipient = sender; // transaction to yourself
      }
      const sender = master_account.addr;
      const recipient = values.account;
      const revocationTarget = undefined;
      const closeRemainderTo = undefined;
      const assetId = parseInt(values.asset); // Correct asset ID?
      const amount = values.amount; // Transfer 100 units of asset aUSD
      const note = algosdk.encodeObj("gifting ASA");
      const transferTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        assetId,
        suggestedParams
      );

      const sk = master_account.sk;

      const rawSignedTxn = transferTxn.signTxn(sk);

      const tx = await algodClient.sendRawTransaction(rawSignedTxn).do();
      //   console.log(tx);
      toast.success(`Asset Creation Txn : ${tx.txId}`);
      // Wait for confirmation
      let confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
      //Get the completed Transaction
      console.log(confirmedTxn);
      console.log(
        "Transaction confirmed in round " + confirmedTxn["confirmed-round"]
      );
      toast.success(
        `Transaction confirmed in round ${confirmedTxn["confirmed-round"]}`
      );
      toast.success(`ASA Created with ID ${confirmedTxn["asset-index"]} `);
      // let accountInfo = await algodClient.accountInformation(master_account.addr).do();
      // toast.success(`${accountInfo}`);
      // console.log(accountInfo);
    } catch (error) {
      console.log("err", error);
      toast.error(`${error.message}`);
    }
  };

  return (
    <Layout title="Transfer ASA">
      <h1 className="text-center">Transfer ASA</h1>
      <div>
        <p>
          Account used to create The ASA :
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://testnet.algoexplorer.io/address/${process.env.ALGO_FAUCET_ACCOUNT_ADDRESS_}`}
          >
            {process.env.ALGO_FAUCET_ACCOUNT_ADDRESS_}
          </a>
        </p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <ToastContainer />
        <div className={styles.grid}>
          <div>
            <label htmlFor="account">Account</label>
            <select name="account" id="account" onChange={handleInputChange}>
              {account_array.map((ac) => (
                <>
                  <option value={ac.address}>{ac.name}</option>
                </>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="asset">ASA</label>
            <select name="asset" id="asset" onChange={handleInputChange}>
              {accountInfo["created-assets"] && accountInfo["created-assets"].map((ast) => <option value={ast.index} key={ast.index} >{ast.params.name}</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              value={values.amount}
              min="0"
              required
              id="amount"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <input type="submit" value="Transfer ASA" className="btn" />
      </form>
    </Layout>
  );
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
