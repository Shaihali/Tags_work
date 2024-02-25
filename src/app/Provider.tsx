"use client";
import { MantineProvider } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import { QueryClientProvider } from "./QueryClientProvider";
import { createMainTheme } from "@/theme";

const theme = createMainTheme();

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider>
    <MantineProvider theme={theme}>{children}</MantineProvider>
  </QueryClientProvider>
);
