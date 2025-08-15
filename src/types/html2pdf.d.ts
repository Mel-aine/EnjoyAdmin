declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string;
    };
    jsPDF?: {
      unit?: string;
      format?: string | number[];
      orientation?: 'portrait' | 'landscape';
    };
    pagebreak?: {
      mode?: string | string[];
      before?: string;
      after?: string;
      avoid?: string;
    };
  }

  interface Html2PdfWorker {
    from(element: HTMLElement): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    to(target: string): Html2PdfWorker;
    output(type: string, options?: any): Promise<any>;
    outputPdf(type?: string): Promise<Blob | string>;
    save(filename?: string): Promise<void>;
    then(onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any): Promise<any>;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Html2PdfWorker;

  export = html2pdf;
}