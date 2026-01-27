// types/react-pdf.d.ts
import * as React from 'react';

declare module '@react-pdf/renderer' {
  export const Document: React.FC<{ children?: React.ReactNode }>;
  export const Page: React.FC<{ size?: string; style?: React.CSSProperties }>;
  export const Text: React.FC<{ style?: React.CSSProperties }>;
  export const View: React.FC<{ style?: React.CSSProperties }>;
  export const StyleSheet: {
    create: (styles: Record<string, any>) => any;
  };
}