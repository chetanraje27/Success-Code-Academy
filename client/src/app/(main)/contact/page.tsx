import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Success Code Academy",
  description:
    "Contact Success Code Academy for course enquiries, campus visits, or admissions support. Fill the form, view the map, and see our classroom imagery.",
};

export default function ContactPage() {
  return <ContactClient />;
}
