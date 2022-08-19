import React, { useContext, useState } from "react";
import { StorageProvider, StorageContext } from "@contexts/StorageContext";

export const Storage = () => {
  const { data, contract, sendData, deployContract } =
    useContext(StorageContext);
  console.log("deployContract", deployContract);
  const [localData, setLocalData] = useState("");

  const onChangeHandler = (event) => {
    setLocalData(event.target.value);
  };

  return (
    <StorageProvider>
      <div>
        <br />
        <button onClick={deployContract}>Deploy new Storage</button>

        <h3>Storage: {contract && contract.address}</h3>
        {contract && (
          <>
            <textarea
              placeholder="New Data"
              type="text"
              name="localData"
              onChange={onChangeHandler}
              value={localData}
            />
            <br />
            <button onClick={() => sendData(localData)}>Save</button>
            <div>{data && data.map((elem) => <p key={elem}>{elem}</p>)}</div>
          </>
        )}
      </div>
    </StorageProvider>
  );
};
