import React, { useContext, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { StorageContext } from "../context/StorageContext";

export const Storage = () => {
  const { data, sendData } = useContext(StorageContext);
  const [localData, setLocalData] = useState("");

  const onChangeHandler = (event) => {
    setLocalData(event.target.value);
  };

  return (
    <div>
      <h3>Storage: {data}</h3>
      <input
        placeholder="New Data"
        type="text"
        name="localData"
        onChange={onChangeHandler}
        value={localData}
      />
      <button onClick={() => sendData(localData)}>Save</button>
    </div>
  );
};
