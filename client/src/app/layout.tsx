import type { Metadata } from "next";
import "./globals.css";
import "./admin/admin.css";
import "./live-editor.css";
import StyledJsxRegistry from "./registry";

export const metadata: Metadata = {
  title: "Success Code Academy",
  description: "Premier educational institution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <StyledJsxRegistry>
          {children}
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
