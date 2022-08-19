import React from "react";
import { Storage as StorageComponent } from "@components";
import { StorageProvider } from "@contexts";

export const Storage = () => (
  <StorageProvider>
    <StorageComponent />
  </StorageProvider>
);
