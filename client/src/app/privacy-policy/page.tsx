import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__content">
        <p className="legal-page__eyebrow">Success Code Academy</p>
        <h1>Privacy Policy</h1>
        <p>
          We use the details you share through our enquiry, registration, and
          contact forms only to respond to you and support your academic
          journey with Success Code Academy.
        </p>

        <h2>Information we collect</h2>
        <p>
          This can include your name, contact details, city, school or college
          details, and information you submit with a course or scholarship
          enquiry.
        </p>

        <h2>How we use it</h2>
        <p>
          We use this information to communicate about admissions, courses,
          scholarship registrations, and related student support. We do not
          sell personal information.
        </p>

        <h2>Questions about your data</h2>
        <p>
          Please <Link href="/contact">contact us</Link> if you would like to
          ask about the information you have submitted.
        </p>
      </div>
    </main>
  );
}
