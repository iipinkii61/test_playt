"use client";

import React from "react";
import "antd/dist/reset.css";
import "../style/global.css";
import { ConfigProvider } from "antd";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ConfigProvider theme={{ token: { colorPrimary: "#8AA624" } }}>
        <body>{children}</body>
      </ConfigProvider>
    </html>
  );
}
