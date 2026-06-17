"use client";

import { useState } from "react";

/**
 * Print + social share row for calculator results.
 *
 * Print: window.print() with a dedicated @media print stylesheet
 * (globals.css) that hides header/nav/footer and keeps only the
 * result card — so what prints is the number, not the whole site.
 *
 * Share: native Web Share API on mobile (one tap, uses the OS sheet —
 * no popup-blocker issues, no third-party SDK weight). Falls back to a
 * row of direct share links (WhatsApp/Twitter/LinkedIn web intents) on
 * desktop where navigator.share is usually unavailable. Copy-link is
 * always offered as the lowest-friction fallback.
 *
 * "Send on mail" was intentionally scoped out per brief — the WhatsApp/
 * email-adjacent need is covered by the share sheet on mobile, where
 * Mail is itself one of the native share targets.
 */
export default function CalculatorActions({
  shareTitle,
  shareText,
}: {
  shareTitle: string;
  shareText: string;
}) {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    setShareOpen((o) => !o);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="no-print relative mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-brand hover:text-brand"
      >
        <PrintIcon />
        Print
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-brand hover:text-brand"
      >
        <ShareIcon />
        Share
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-brand hover:text-brand"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>

      {shareOpen && (
        <div className="absolute top-full left-0 z-10 mt-2 flex gap-2 rounded-xl border border-rule bg-surface p-2 shadow-card-lg">
          <a
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper"
          >
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper"
          >
            X / Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper"
          >
            LinkedIn
          </a>
        </div>
      )}
    </div>
  );
}

function PrintIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
