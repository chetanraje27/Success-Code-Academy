"use client";

import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  style,
}: ButtonProps) {
  const baseClass = `btn btn-${variant} btn-${size} ${className}`;

  if (href) {
    if (disabled) {
      return (
        <>
          <span className={baseClass} aria-disabled="true" style={style}>
            {children}
          </span>
          <style jsx>{buttonStyles}</style>
        </>
      );
    }

    return (
      <>
        <Link href={href} className={baseClass} style={style}>
          {children}
        </Link>
        <style jsx>{buttonStyles}</style>
      </>
    );
  }

  return (
    <>
      <button type={type} onClick={disabled ? undefined : onClick} className={baseClass} disabled={disabled} style={style}>
        {children}
      </button>
      <style jsx>{buttonStyles}</style>
    </>
  );
}

const buttonStyles = `
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border-radius: var(--radius-full);
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    outline: none;
    text-align: center;
  }

  .btn:active {
    transform: scale(0.98);
  }

  /* Sizes */
  .btn-sm {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: 0.875rem;
    gap: var(--spacing-2);
  }

  .btn-md {
    padding: var(--spacing-3) var(--spacing-6);
    font-size: 1rem;
    gap: var(--spacing-2);
  }

  .btn-lg {
    padding: var(--spacing-4) var(--spacing-8);
    font-size: 1.125rem;
    gap: var(--spacing-3);
  }

  /* Variants */
  .btn-primary {
    background-color: var(--accent-primary);
    color: white;
  }

  .btn-primary:hover {
    background-color: var(--accent-secondary); /* Vibrant blue hover */
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  }

  .btn-secondary {
    background-color: var(--accent-secondary);
    color: white;
  }

  .btn-secondary:hover {
    background-color: #1e3a8a; /* darker vibrant blue */
    box-shadow: 0 4px 12px rgba(30, 58, 138, 0.25);
  }

  .btn-outline {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--bg-surface-border);
  }

  .btn-outline:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--text-secondary);
  }

  .btn-ghost:hover {
    background-color: var(--bg-surface-hover);
    color: var(--text-primary);
  }
`;