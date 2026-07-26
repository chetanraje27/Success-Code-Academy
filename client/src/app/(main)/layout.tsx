import type { Metadata } from "next";
import "../live-editor.css";
import "../admin/admin.css";
import "../public.css";
import "./home/home.css";
import "./about/about.css";
import "./courses/courses.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/layout/WhatsAppWidget";
import CookieConsent from "@/components/layout/CookieConsent";
import { EditModeProvider } from "@/components/admin/EditModeContext";
import LeadsDrawer from "@/components/admin/LeadsDrawer";
import { LiveContentProvider } from "@/components/admin/LiveContentContext";
import { LiveEditorToolbar } from "@/components/admin/LiveEditorToolbar";


export const metadata: Metadata = {
  title: "Success Code Academy | Premier Educational Institution",
  description:
    "Success Code Academy is a premier educational institution dedicated to academic excellence, holistic development, and shaping tomorrow's leaders since 2000. Explore our programs in Science, Arts, Commerce, and more.",
  keywords:
    "education, academy, college, school, science, arts, commerce, courses, Mumbai, India, success code academy",
  openGraph: {
    title: "Success Code Academy | Premier Educational Institution",
    description:
      "Premier educational institution dedicated to academic excellence and shaping tomorrow's leaders.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EditModeProvider>
      <LiveContentProvider>
        <div className="public-shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
          <WhatsAppWidget />
          <CookieConsent />
          <LeadsDrawer />
          <LiveEditorToolbar />
        </div>
      </LiveContentProvider>
    </EditModeProvider>
  );
}
