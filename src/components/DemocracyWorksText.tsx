import Link from "next/link";
import { Fragment, type ReactNode } from "react";

function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/(?:<br\s*\/?>\s*)+/gi)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseParagraphForAnchors(
  paragraph: string,
  paragraphIndex: number,
  renderLink: (props: { href: string; children: string }) => ReactNode,
): ReactNode[] {
  const segments: ReactNode[] = [];
  const anchorRegex = /<a\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = anchorRegex.exec(paragraph)) !== null) {
    if (match.index > lastIndex) {
      segments.push(
        <Fragment key={`p${paragraphIndex}-${keyIndex++}`}>
          {paragraph.slice(lastIndex, match.index)}
        </Fragment>,
      );
    }
    segments.push(
      <Fragment key={`p${paragraphIndex}-${keyIndex++}`}>
        {renderLink({ href: match[1], children: match[2] })}
      </Fragment>,
    );
    lastIndex = anchorRegex.lastIndex;
  }

  if (lastIndex < paragraph.length) {
    segments.push(
      <Fragment key={`p${paragraphIndex}-${keyIndex++}`}>
        {paragraph.slice(lastIndex)}
      </Fragment>,
    );
  }

  return segments.length > 0
    ? segments
    : [<Fragment key={`p${paragraphIndex}-0`}>{paragraph}</Fragment>];
}

export type DemocracyWorksTextRenderers = {
  /** Renders a paragraph wrapper. Default: <p>{children}</p> */
  paragraph?: (children: ReactNode) => ReactNode;
  /** Renders an anchor/link. Default: Next.js Link with external URL handling */
  link?: (props: { href: string; children: string }) => ReactNode;
};

type DemocracyWorksTextProps = {
  text: string;
  renderers?: DemocracyWorksTextRenderers;
};

const defaultParagraphRenderer = (children: ReactNode) => <p>{children}</p>;

const defaultLinkRenderer = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => {
  const isInternal = href.startsWith("/");
  return (
    <Link
      href={href}
      className="text-ink-600 font-bold hover:underline hover:underline-offset-2"
      {...(!isInternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {children}
    </Link>
  );
};

export function DemocracyWorksText({
  text,
  renderers = {},
}: DemocracyWorksTextProps): ReactNode {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const paragraphRenderer = renderers.paragraph ?? defaultParagraphRenderer;
  const linkRenderer = renderers.link ?? defaultLinkRenderer;

  const paragraphs = splitIntoParagraphs(trimmed);

  return (
    <>
      {paragraphs.map((paragraphStr, index) => (
        <Fragment key={index}>
          {paragraphRenderer(
            parseParagraphForAnchors(paragraphStr, index, linkRenderer),
          )}
        </Fragment>
      ))}
    </>
  );
}
