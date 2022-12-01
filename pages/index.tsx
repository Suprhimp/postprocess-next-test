import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";

import { model } from "../src/model/model";

export default function Home() {
  const modelContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (modelContainer.current) model(modelContainer.current);
  }, []);

  return (
    <>
      <div className={styles.container} ref={modelContainer} id="modelContainer" />
    </>
  );
}
