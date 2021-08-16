declare module '*.module.scss' {
   const classNames: {
      [name: string]: string;
   };
   export default classNames;
}

declare module 'intersection-observer' {
   export {};
}

declare module 'scrolling-based-progressbar' {
   export const ProgressBar: any;
}
