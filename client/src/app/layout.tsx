import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/tokens.css";
import "./globals.css";
import StyledJsxRegistry from "./registry";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-admin",
  weight: ["400", "500", "600"],
});

/*
 * Applies the saved admin theme before first paint so the dashboard never
 * flashes light before switching to dark. Scoped to /admin so the public site
 * is never themed -- it shares admin.css but must always render light.
 * Kept as a raw inline script (not next/script) because it has to execute
 * synchronously during HTML parsing, ahead of any paint.
 */
const adminThemeScript = `(function(){try{if(!location.pathname.startsWith("/admin"))return;var t=localStorage.getItem("sca-admin-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-admin-theme",t)}catch(e){}})();`;

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
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script dangerouslySetInnerHTML={{ __html: adminThemeScript }} />
      </head>
      <body>
        <StyledJsxRegistry>
          {children}
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
