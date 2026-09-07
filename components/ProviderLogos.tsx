import React from 'react';

interface LogoProps {
  className?: string;
}

export function OpenAILogo({ className = 'w-4 h-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.74a4.48 4.48 0 0 1 2.366-1.973v5.68a.79.79 0 0 0 .388.677l5.843 3.37-2.02 1.168a.076.076 0 0 1-.067 0L4.013 14.87A4.496 4.496 0 0 1 2.34 8.74zm15.797 3.925l-5.843-3.37 2.02-1.168a.076.076 0 0 1 .067 0l4.837 2.791a4.494 4.494 0 0 1-.674 8.16v-5.736a.79.79 0 0 0-.407-.677zm2.263-4.22a4.47 4.47 0 0 1 .535 3.014l-.142-.085-4.783-2.759a.771.771 0 0 0-.78 0l-5.843 3.369V9.656a.08.08 0 0 1 .033-.062L14.26 6.8a4.5 4.5 0 0 1 6.14 1.646zm-8.868-3.415a4.476 4.476 0 0 1 2.876 1.04l-.141.081-4.779 2.758a.795.795 0 0 0-.392.681v6.737l-2.02-1.168a.071.071 0 0 1-.038-.052V9.897a4.504 4.504 0 0 1 4.494-4.494zm-1.4 6.945l2.876-1.66 2.876 1.66v3.32l-2.876 1.66-2.876-1.66z" />
    </svg>
  );
}

export function AnthropicLogo({ className = 'w-4 h-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 4.2h-3.666L7.29 20.2h3.582l1.32-3.138h5.364l1.32 3.138H22.5L17.472 4.2zm-4.08 9.948l1.794-4.272 1.794 4.272h-3.588zM4.59 4.2H1.5L6.69 16.5l3.09-7.35L4.59 4.2z" />
    </svg>
  );
}

export function GoogleGeminiLogo({ className = 'w-4 h-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
    </svg>
  );
}

export function DeepSeekLogo({ className = 'w-4 h-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z" />
    </svg>
  );
}

export function MetaLogo({ className = 'w-4 h-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.332c-3.076 0-5.834 1.83-7.234 4.545C3.366 11.59 3.96 14.86 6.2 16.994c1.82 1.737 4.385 2.674 7.034 2.674 3.075 0 5.833-1.83 7.233-4.545 1.4-2.714.806-5.983-1.433-8.118C17.214 5.268 14.65 4.332 12 4.332zm-.72 9.946c-1.353 0-2.45-.98-2.45-2.28 0-1.298 1.097-2.278 2.45-2.278 1.354 0 2.451.98 2.451 2.278 0 1.3-.097 2.28-2.451 2.28z" />
    </svg>
  );
}

export function MistralLogo({ className = 'w-4 h-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h4v4H3zm14 0h4v4h-4zM3 17h4v4H3zm14 0h4v4h-4zM7 7h4v4H7zm6 0h4v4h-4zM7 13h4v4H7zm6 0h4v4h-4zm-3-3h4v4h-4z" />
    </svg>
  );
}

export function NvidiaLogo({ className = 'w-4 h-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.94 8.77c.36 0 .66.29.66.66v6.14c0 .36-.3.66-.66.66H6.3c-.36 0-.66-.3-.66-.66V9.43c0-.36.3-.66.66-.66h2.64zm6.12 0c.36 0 .66.29.66.66v6.14c0 .36-.3.66-.66.66h-2.64c-.36 0-.66-.3-.66-.66V9.43c0-.36.3-.66.66-.66h2.64zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

export function ProviderIcon({ provider, className = 'w-4 h-4' }: { provider: string; className?: string }) {
  switch (provider.toLowerCase()) {
    case 'openai':
      return <OpenAILogo className={className} />;
    case 'anthropic':
      return <AnthropicLogo className={className} />;
    case 'google':
      return <GoogleGeminiLogo className={className} />;
    case 'deepseek':
      return <DeepSeekLogo className={className} />;
    case 'meta (hosted)':
    case 'meta':
      return <MetaLogo className={className} />;
    case 'mistral':
      return <MistralLogo className={className} />;
    default:
      return <OpenAILogo className={className} />;
  }
}
