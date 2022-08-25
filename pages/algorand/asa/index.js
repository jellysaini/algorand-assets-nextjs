import Layout from "@/components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import styles from "@/styles/Form.module.css";
// import { ALGO_FAUCET_ACCOUNT_ADDRESS_, PER_PAGE_ } from '@/config/index'
import algosdk from "algosdk";
import { waitForConfirmation } from "@/helpers/utils";

export default function ASAPage() {
  const baseServer = process.env.ALGO_SERVER_;
  const port = "";
  const token = {
    "X-API-Key": process.env.ALGO_TOKEN_,
  };
  const master_account = algosdk.mnemonicToSecretKey(process.env.ALGO_FAUCET_PASSPHRASE_)
  console.log(master_account.addr)
  // const accountInfo = async () => await algodClient.accountInformation(address).do();
  // console.log(accountInfo);

  const [values, setValues] = useState({
    total: 100,
    decimals: 0,
    defaultFrozen: false,
    unitName: "AR",
    assetName: "Algorand Asset",
    note: "ASA Note",
    assetURL: "https://images.unsplash.com/photo-1599690925058-90e1a0b56154?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
    from: process.env.ALGO_FAUCET_ACCOUNT_ADDRESS_,
    manager: process.env.ALGO_FAUCET_ACCOUNT_ADDRESS_,
    reserve: process.env.ALGO_FAUCET_ACCOUNT_ADDRESS_,
    freeze: process.env.ALGO_FAUCET_ACCOUNT_ADDRESS_,
    clawback: process.env.ALGO_FAUCET_ACCOUNT_ADDRESS_,
  });
  {
    /* 

  makeAssetCreateTxnWithSuggestedParams(from: string, note: Uint8Array, total: number | bigint,
     decimals: number, defaultFrozen: boolean, manager: string,
      reserve: string, freeze: string, clawback: string, unitName: string, 
      assetName: string, assetURL: string, assetMetadataHash: string | Uint8Array, 
      suggestedParams: SuggestedParams, rekeyTo?: string): 

  makeAssetCreateTxnWithSuggestedParamsFromObject(o: { assetMetadataHash?: string | Uint8Array;
     assetName?: string; assetURL?: string; clawback?: string; decimals: number; defaultFrozen: boolean; 
     freeze?: string; from: string; manager?: string; note?: Uint8Array; rekeyTo?: string; reserve?: string; 
     suggestedParams: SuggestedParams; total: number | bigint; unitName?: string }):

*/
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleSubmit = async (e) => {
    toast.info('Create ASA Start')
    e.preventDefault();
    const algodClient = new algosdk.Algodv2(token, baseServer, port);

    console.log(algodClient);

    // Validation
    //   const hasEmptyFields = Object.values(values).some(
    //     function(element, index, array) {
    //       console.log(element)
    //       console.log(index)
    //       console.log(array)
    //       console.log(values)
    //       return element === ""
    //     }
    //   );

    //   if (hasEmptyFields) {
    //     toast.error("Please fill in all fields");
    //   }
    try {
      // toast.error(`${Object.values(values)}`);
      const suggestedParams = await algodClient.getTransactionParams().do();
      console.log(suggestedParams);
      values.suggestedParams = suggestedParams;
      // values.note = algosdk.encodeObj(values.note)
      values.assetMetadataHash = ""
      console.log(values);
      // const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(values)
      // const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      //   (from = values.from),
      //   (note = values.note),

      //   (total = values.total),
      //   (decimals = values.decimals),

      //   (defaultFrozen = values.defaultFrozen),
      //   (manager = values.manager),
      //   (reserve = values.reserve),
      //   (freeze = values.freeze),
      //   (clawback = values.clawback),
      //   (unitName = values.unitName),
      //   (assetName = values.assetName),
      //   (assetURL = values.assetURL),
      //   (assetMetadataHash = undefined),
      //   (suggestedParams = values.SuggestedParams)
      // );
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        values.from, // from address
        algosdk.encodeObj(values.note), // note

        values.total, // total asset
        values.decimals,

        values.defaultFrozen,
        values.manager,
        values.reserve,
        values.freeze,
        values.clawback,
        values.unitName,
        values.assetName,
        values.assetURL,
        values.assetMetadataHash,
        values.suggestedParams
      );

      console.log(txn);
      // const pk = algosdk.encodeObj(process.env.ALGO_FAUCET_PRIVATE_KEY_)
      const sk = master_account.sk
      console.log(sk);
      const rawSignedTxn = txn.signTxn(sk);
      console.log(rawSignedTxn);
      const tx = await algodClient.sendRawTransaction(rawSignedTxn).do();
      console.log(tx);
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
    <Layout title="Create ASA">
      <h1 className="text-center">Create ASA</h1>
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
            <label htmlFor="total">Total</label>
            <input
              type="number"
              name="total"
              value={values.total}
              min="0"
              required
              id="total"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="decimals">decimals</label>
            <input
              type="number"
              name="decimals"
              value={values.decimals}
              min="0"
              max="19"
              required
              id="decimals"
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.form_check}>
            <input
              className={styles.form_check_input}
              type="checkbox"
              name="defaultFrozen"
              value={values.defaultFrozen}
              onChange={handleInputChange}
            />
            <label className={styles.form_check_label} htmlFor="defaultFrozen">
              defaultFrozen
            </label>
          </div>

          <div>
            <label htmlFor="unitName">Unit Name</label>
            <input
              type="text"
              name="unitName"
              value={values.unitName}
              maxLength="64"
              required
              id="unitName"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="assetName">Asset Name</label>
            <input
              type="text"
              name="assetName"
              value={values.assetName}
              maxLength="128"
              required
              id="assetName"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="note">Note</label>
            <input
              type="text"
              name="note"
              value={values.note}
              maxLength="512"
              id="note"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="assetURL">Url</label>
            <input
              type="url"
              name="assetURL"
              value={values.assetURL}
              id="assetURL"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="manager">Manager</label>
            <input
              type="text"
              name="manager"
              value={values.manager}
              maxLength="128"
              id="manager"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="freeze">Freeze</label>
            <input
              type="text"
              name="freeze"
              value={values.freeze}
              maxLength="128"
              id="freeze"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="clawback">Clawback</label>
            <input
              type="text"
              name="clawback"
              value={values.clawback}
              maxLength="128"
              id="clawback"
              onChange={handleInputChange}
            />
          </div>

          {/* <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div> */}
        </div>
        <input type="submit" value="Add ASA" className="btn" />
      </form>
    </Layout>
  );
}
