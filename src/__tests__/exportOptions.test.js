import { describe, expect, it } from 'vitest';
import { hexToRgb } from '../ExportOptions.jsx';

describe('hexToRgb', () => {
  it('converts valid hex string to rgb string', () => {
    expect(hexToRgb('#ffffff')).toBe('255, 255, 255');
    expect(hexToRgb('#000000')).toBe('0, 0, 0');
    expect(hexToRgb('#1a2b3c')).toBe('26, 43, 60');
  });

  it('falls back to 0,0,0 for invalid values', () => {
    expect(hexToRgb('invalid')).toBe('0, 0, 0');
    expect(hexToRgb('#zzz')).toBe('0, 0, 0');
  });
});
