import { DOCUMENT } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Rich-text coming from the API (blog bodies, articles, biographies) cannot be
 * trusted. Angular's built-in `[innerHTML]` sanitizer blocks scripts, but it
 * also strips every `style` attribute, which would throw away the alignment
 * and table layout produced by CKEditor. This module therefore rebuilds the
 * HTML from an allow-list: unknown elements are unwrapped, dangerous elements
 * and attributes are dropped, URLs and inline CSS are validated.
 */

const ALLOWED_TAGS = new Set([
  'a',
  'abbr',
  'b',
  'blockquote',
  'br',
  'caption',
  'code',
  'col',
  'colgroup',
  'dd',
  'del',
  'div',
  'dl',
  'dt',
  'em',
  'figcaption',
  'figure',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'ins',
  'li',
  'mark',
  'ol',
  'p',
  'pre',
  's',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
]);

/** Elements whose content must never reach the page, even as text. */
const DROPPED_TAGS = new Set([
  'base',
  'button',
  'embed',
  'form',
  'head',
  'iframe',
  'input',
  'link',
  'math',
  'meta',
  'noscript',
  'object',
  'script',
  'select',
  'style',
  'svg',
  'template',
  'textarea',
  'title',
]);

const ALLOWED_ATTRIBUTES = new Set([
  'align',
  'alt',
  'class',
  'colspan',
  'dir',
  'height',
  'href',
  'lang',
  'rel',
  'rowspan',
  'scope',
  'src',
  'start',
  'style',
  'target',
  'title',
  'type',
  'valign',
  'width',
]);

/** Inline properties CKEditor may emit for alignment, tables and resizing. */
const ALLOWED_STYLES = new Set([
  'background-color',
  'border',
  'border-collapse',
  'border-color',
  'border-style',
  'border-width',
  'color',
  'direction',
  'float',
  'font-size',
  'font-style',
  'font-weight',
  'height',
  'line-height',
  'list-style-type',
  'margin',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'max-width',
  'min-width',
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'text-align',
  'text-decoration',
  'unicode-bidi',
  'vertical-align',
  'white-space',
  'width',
]);

const UNSAFE_STYLE_VALUE = /url\s*\(|expression\s*\(|javascript:|@import|[<>\\]/i;
const SAFE_CLASS_TOKEN = /^[a-z][a-z0-9_-]{0,60}$/i;
const MAX_DEPTH = 50;

function isSafeUrl(value: string): boolean {
  // Collapse control characters that browsers ignore when parsing a scheme.
  const url = value.replace(/[\u0000-\u0020\u007f]+/g, '').toLowerCase();

  if (!url) {
    return false;
  }

  if (url.startsWith('#') || url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return true;
  }

  return /^(https?:|mailto:|tel:)/.test(url);
}

function sanitizeStyle(value: string): string {
  return value
    .split(';')
    .map((declaration) => {
      const separator = declaration.indexOf(':');

      if (separator < 0) {
        return '';
      }

      const property = declaration.slice(0, separator).trim().toLowerCase();
      const propertyValue = declaration.slice(separator + 1).trim();

      if (!ALLOWED_STYLES.has(property) || !propertyValue || UNSAFE_STYLE_VALUE.test(propertyValue)) {
        return '';
      }

      return `${property}: ${propertyValue}`;
    })
    .filter(Boolean)
    .join('; ');
}

function sanitizeClass(value: string): string {
  return value
    .split(/\s+/)
    .filter((token) => SAFE_CLASS_TOKEN.test(token))
    .join(' ');
}

function sanitizeAttributes(source: Element, target: Element): void {
  for (const attribute of Array.from(source.attributes)) {
    const name = attribute.name.toLowerCase();

    if (!ALLOWED_ATTRIBUTES.has(name)) {
      continue;
    }

    const value = attribute.value;

    if (name === 'href' || name === 'src') {
      if (!isSafeUrl(value)) {
        continue;
      }
    } else if (name === 'style') {
      const style = sanitizeStyle(value);

      if (style) {
        target.setAttribute('style', style);
      }

      continue;
    } else if (name === 'class') {
      const className = sanitizeClass(value);

      if (className) {
        target.setAttribute('class', className);
      }

      continue;
    }

    target.setAttribute(name, value);
  }

  if (target.tagName.toLowerCase() === 'a' && target.getAttribute('target') === '_blank') {
    target.setAttribute('rel', 'noopener noreferrer');
  }
}

function copyChildren(source: Node, target: Node, document: Document, depth: number): void {
  if (depth > MAX_DEPTH) {
    return;
  }

  for (const child of Array.from(source.childNodes)) {
    if (child.nodeType === 3 /* text */) {
      target.appendChild(document.createTextNode(child.nodeValue ?? ''));
      continue;
    }

    if (child.nodeType !== 1 /* element */) {
      continue;
    }

    const element = child as Element;
    const tagName = element.tagName.toLowerCase();

    if (DROPPED_TAGS.has(tagName)) {
      continue;
    }

    if (!ALLOWED_TAGS.has(tagName)) {
      // Unknown wrappers are removed but their safe content is preserved.
      copyChildren(element, target, document, depth + 1);
      continue;
    }

    if (tagName === 'img' && !isSafeUrl(element.getAttribute('src') ?? '')) {
      continue;
    }

    const clean = document.createElement(tagName === 'img' ? 'img' : tagName);
    sanitizeAttributes(element, clean);
    copyChildren(element, clean, document, depth + 1);
    target.appendChild(clean);
  }
}

/**
 * Returns an allow-listed, script-free version of the given HTML string.
 * Pass the platform `Document` so the same code works in the browser and in
 * server-side rendering.
 */
export function sanitizeRichText(html: string | null | undefined, document: Document): string {
  if (!html) {
    return '';
  }

  try {
    const source = document.createElement('div');
    source.innerHTML = html;

    const output = document.createElement('div');
    copyChildren(source, output, document, 0);

    return output.innerHTML;
  } catch {
    // If the platform cannot parse HTML, render nothing rather than raw input.
    return '';
  }
}

@Pipe({
  name: 'richText',
  standalone: true,
})
export class RichTextPipe implements PipeTransform {
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    const html = sanitizeRichText(value, this.document);

    // The markup was already rebuilt from the allow-list above, so it is
    // safe to bypass Angular's HTML sanitizer (which would drop styling).
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
