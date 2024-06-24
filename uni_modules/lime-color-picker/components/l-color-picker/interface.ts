import type {RGB, RGBA} from './tinycolor/interfaces'
import type {Color} from './color'

// 增加部分
export interface HSB {
  h: number | string;
  s: number | string;
  b: number | string;
}
export interface HSBA extends HSB {
  a: number;
}


export type ColorGenInput<T = Color> =
  | string
  | number
  | RGB
  | RGBA
  | HSB
  | HSBA
  | T;
  
  
export interface PickerEl {
	width: number
	height: number
	radius: number
}