import type { ColorInput } from './tinycolor';
import { ColorFactory } from './color';
import type { ColorGenInput, HSB } from './interface';

export const ColorPickerPrefixCls = 'rc-color-picker';

export const getRoundNumber = (value: number) => Math.round(Number(value || 0));

export const convertHsb2Hsv = (color: ColorGenInput): ColorInput => {
  if (color && typeof color === 'object' && 'h' in color && 'b' in color) {
    const { b, ...resets } = color as HSB;
    return {
      ...resets,
      v: b,
    };
  }
  if (typeof color === 'string' && /hsb/.test(color)) {
    return color.replace(/hsb/, 'hsv');
  }
  return color as ColorInput;
};

export const generateColor = (color: ColorGenInput): ColorFactory => {
  if (color instanceof ColorFactory) {
    return color;
  }
  return new ColorFactory(color);
};

export const getAlphaColor = (color: ColorFactory) => getRoundNumber(color.toHsb().a * 100);
export const toHexFormat = (value?: string, alpha?: boolean) => value?.replace(/[^\w/]/gi, '').slice(0, alpha ? 8 : 6) || '';
export const getHex = (value?: string, alpha?: boolean) => (value ? toHexFormat(value, alpha) : '');
export const getFormatColor = (value: string) => value.match(/\d+/g).map(item => Number(item)).filter((item: number, index) => index < 3)