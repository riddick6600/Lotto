import React from "react";
import { Casino } from "@components";
import { CasinoProvider } from "@contexts";

export const Home = () => (
  <CasinoProvider>
    <Casino />
  </CasinoProvider>
);
