import { sanitizeRichText } from './rich-text';

describe('sanitizeRichText', () => {
  const document = globalThis.document;

  function clean(html: string): string {
    return sanitizeRichText(html, document);
  }

  it('returns an empty string for empty input', () => {
    expect(clean('')).toBe('');
    expect(sanitizeRichText(null, document)).toBe('');
    expect(sanitizeRichText(undefined, document)).toBe('');
  });

  it('removes scripts, event handlers and javascript: links', () => {
    const result = clean(
      '<p onclick="steal()">سلام</p><script>alert(1)</script>' +
        '<a href="javascript:alert(1)">لینک</a><img src="x" onerror="alert(1)">',
    );

    expect(result).not.toContain('script');
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('javascript:');
    expect(result).toContain('سلام');
  });

  it('keeps the formatting CKEditor produces', () => {
    const result = clean(
      '<h2 dir="rtl">تیتر</h2>' +
        '<p style="text-align: center">وسط</p>' +
        '<ul><li>یک</li><li>دو</li></ul>' +
        '<table><tbody><tr><th colspan="2">سرستون</th></tr></tbody></table>',
    );

    expect(result).toContain('<h2 dir="rtl">تیتر</h2>');
    expect(result).toContain('text-align: center');
    expect(result).toContain('<li>یک</li>');
    expect(result).toContain('colspan="2"');
  });

  it('drops inline styles that could load remote resources', () => {
    const result = clean('<p style="background-image: url(//evil.test/a.png); text-align: right">متن</p>');

    expect(result).not.toContain('url(');
    expect(result).not.toContain('background-image');
    expect(result).toContain('text-align: right');
  });

  it('hardens links that open a new tab', () => {
    const result = clean('<a href="https://example.com" target="_blank">لینک</a>');

    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('unwraps unknown elements but keeps their text', () => {
    const result = clean('<div><custom-tag>متن مجاز</custom-tag></div>');

    expect(result).not.toContain('custom-tag');
    expect(result).toContain('متن مجاز');
  });
});
