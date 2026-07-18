interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading align-${align} ${light ? "is-light" : ""}`}>
      <h2 className="title">{title}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}

      <style jsx>{`
        .section-heading {
          max-width: 800px;
          margin: 0 auto;
        }

        .align-center {
          text-align: center;
        }

        .align-left {
          text-align: left;
          margin-left: 0;
        }

        .title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: var(--spacing-2);
        }

        .is-light .title {
          color: #ffffff;
        }

        .subtitle {
          margin-top: var(--spacing-4);
          font-size: 1.125rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .is-light .subtitle {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}