import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/tokens.css";
import "./globals.css";
import StyledJsxRegistry from "./registry";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


export const metadata = {
  title: 'Success Code Academy | NEET Coaching in Baramati',
  description: "Baramati's top NEET coaching institute. Home to this year's AIR 5 NEET topper and outstanding medical entrance results.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={inter.variable}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <StyledJsxRegistry>
          {children}
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
