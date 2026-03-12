import { Work_Sans } from "next/font/google";
import React from "react";
import "./styles.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata = {
  title: "The Civics Center",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en" className={`${workSans.variable}`}>
      <head>
        <link
          rel="preload"
          href="https://static.everyaction.com/ea-actiontag/at.min.css"
          as="style"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
