import { describe, expect, it } from 'vitest';
import { sanitize } from '@app/common/utils/sanitize';

describe('sanitize', () => {
  it('returns undefined and null unchanged', () => {
    const nullable = JSON.parse('null') as null;
    expect(sanitize(undefined)).toBeUndefined();
    expect(sanitize(nullable)).toBeNull();
  });

  it('sanitizes html', () => {
    const result = sanitize('  <script>alert(1)</script><b>Hello</b>  ');
    expect(result).toBe('<b>Hello</b>');
  });

  it('returns plain text when textOnly is true', () => {
    const result = sanitize('<b>Hello</b>&nbsp;World', { textOnly: true });
    expect(result).toBe('<b>Hello</b>\u00A0World');
  });
});
