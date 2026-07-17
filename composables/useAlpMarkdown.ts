/**
 * Markdown and HTML rendering composable using marked + DOMPurify.
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked for compact output
marked.setOptions({
    breaks: true,
    gfm: true
});

const MARKDOWN_ALLOWED_TAGS = [
    'p',
    'br',
    'strong',
    'em',
    'b',
    'i',
    'code',
    'pre',
    'ul',
    'ol',
    'li',
    'a',
    'h1',
    'h2',
    'h3',
    'h4',
    'blockquote',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'hr',
    'del',
    'span'
];

const HTML_ALLOWED_TAGS = [
    ...MARKDOWN_ALLOWED_TAGS,
    'div',
    'section',
    'article',
    'header',
    'footer',
    'nav',
    'main',
    'aside',
    'h5',
    'h6',
    'figure',
    'figcaption',
    'details',
    'summary',
    'img',
    'picture',
    'source',
    'svg',
    'path',
    'dl',
    'dt',
    'dd',
    'abbr',
    'mark',
    'sub',
    'sup',
    'small',
    'caption',
    'colgroup',
    'col'
];

const HTML_ALLOWED_ATTR = [
    'href',
    'target',
    'rel',
    'class',
    'id',
    'style',
    'src',
    'alt',
    'width',
    'height',
    'loading',
    'colspan',
    'rowspan',
    'scope',
    'open',
    'title',
    'viewBox',
    'fill',
    'd',
    'xmlns',
    'stroke',
    'stroke-width'
];

/**
 * Detect whether content is HTML (as opposed to markdown).
 *
 * Checks if the trimmed content starts with an HTML tag or doctype,
 * which is the pattern for agent-generated HTML reports.
 */
function isHtmlContent(text: string): boolean {
    const trimmed = text.trimStart();
    return /^<!doctype\s|^<(html|head|body|div|section|article|header|main|table|figure|style)\b/i.test(
        trimmed
    );
}

/**
 * Render markdown to sanitized HTML.
 */
function renderMarkdown(text: string): string {
    if (!text) return '';
    const html = marked.parse(text, { async: false }) as string;
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: MARKDOWN_ALLOWED_TAGS,
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    });
}

/**
 * Sanitize HTML content without markdown parsing.
 */
function renderHtml(text: string): string {
    if (!text) return '';
    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: HTML_ALLOWED_TAGS,
        ALLOWED_ATTR: HTML_ALLOWED_ATTR
    });
}

/**
 * Render content as either HTML or markdown, auto-detecting the format.
 *
 * Use this for content fields that may contain either format (e.g., project
 * resources where agents publish HTML reports and humans write markdown).
 */
function renderContent(text: string): string {
    if (!text) return '';
    return isHtmlContent(text) ? renderHtml(text) : renderMarkdown(text);
}

export function useAlpMarkdown() {
    return { renderMarkdown, renderHtml, renderContent };
}
