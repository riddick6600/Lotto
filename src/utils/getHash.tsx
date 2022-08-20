import React from "react";

export const getHash = (address: string) => (
  <span title={address}>...{address.substr(-6)}</span>
);
