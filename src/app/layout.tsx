import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import { FC, PropsWithChildren } from "react";
import { Providers } from "./Provider";
import "./global.css";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dobrofon-tag_test",
  description: "Работа с тегами",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html className={inter.className} lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
