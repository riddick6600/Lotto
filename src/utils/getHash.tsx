import React from "react";
import { toast } from "react-toastify";

export const getHash = (address: string) => {
  const clickHandle = async () => {
    await navigator.clipboard.writeText(address);
    toast(`${address} Coppied`);
  };
  return (
    <span className="hash" title={address} onClick={clickHandle}>
      ...{address.substr(-6)}
    </span>
  );
};
