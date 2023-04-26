import { Dimensions } from 'react-native';
import type { Preset } from '@twind/core';
import type { RemToPxBaseOptions } from './types';

const transformLineHeight = (rule?: string) => {
  return rule?.replace(/(line-height:)(1)/g, (match, p1, p2) => {
    if (Number(p2) !== 1) return match;
    return `${p1}${Number(p2) === 1 ? 0 : p2}`;
  });
};

const dimensions = Dimensions.get('screen');

export default function presetRemToPx({ baseRem = 16 }: RemToPxBaseOptions): Preset {
  return {
    finalize(rule) {
      if (rule.n?.startsWith('text')) {
        rule.d = transformLineHeight(rule.d);
      }
      if (rule.d && rule.d.includes('vh')) {
        rule.d = rule.d.replace(
          /"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)vh/g,
          (match, p1) => {
            if (p1 === undefined) return match;
            return `${dimensions.height * (Number(p1) / 100)}${p1 == 0 ? '' : 'px'}`;
          },
        );
        return rule;
      }
      if (rule.d && rule.d.includes('vw')) {
        rule.d = rule.d.replace(
          /"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)vw/g,
          (match, p1) => {
            if (p1 === undefined) return match;
            return `${dimensions.width * (Number(p1) / 100)}${p1 == 0 ? '' : 'px'}`;
          },
        );
        return rule;
      }
      return {
        ...rule,
        // d: the CSS declaration body
        // Based on https://github.com/TheDutchCoder/postcss-rem-to-px/blob/main/index.js
        d: rule.d?.replace(/"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)rem/g, (match, p1) => {
          if (p1 === undefined) return match;
          return `${p1 * baseRem}${p1 == 0 ? '' : 'px'}`;
        }),
      };
    },
  };
}
