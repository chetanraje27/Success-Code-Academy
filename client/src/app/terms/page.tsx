import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__content">
        <p className="legal-page__eyebrow">Success Code Academy</p>
        <h1>Terms of Service</h1>
        <p>
          By using this website or submitting a form, you agree that Success
          Code Academy may contact you about the course, admission, or
          scholarship information you requested.
        </p>

        <h2>Website information</h2>
        <p>
          Course information, schedules, and admissions details are shared for
          general guidance and may be updated when required.
        </p>

        <h2>Respectful use</h2>
        <p>
          Please use this website lawfully and do not attempt to interfere with
          its operation, content, or security.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about these terms, please <Link href="/contact">get
          in touch with us</Link>.
        </p>
      </div>
    </main>
  );
}
