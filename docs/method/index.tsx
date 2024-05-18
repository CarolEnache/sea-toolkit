import html_to_pdf from 'html-pdf-node';
import { renderToString } from 'react-dom/server';

const config = {
  options: {
    format: 'A4'
  },
  file: {
    content: './input.tsx'
  }
};

const configFile = Bun.file('./.react-pdf');
if (await configFile.exists()) {
  Object.assign(config, await configFile.json());
} else {
  console.warn('You can configure the pdf build with a .react-pdf file');
}

if (config.file.content) {
  const module = await import(config.file.content);
  const Component = module.default;
  config.file.content = renderToString()
}
// let file = { content: renderToString(<><style>{`h1{color:blue;}`}</style><h1>Welcome to html-pdf-node</h1></>) };

// html_to_pdf.generatePdf(file, options, (error, pdfBuffer) => {
//   if (error) {
//     console.error(error);
//   } else {
//     const fileWriter = Bun.file('./result.pdf').writer();
//     fileWriter.write(pdfBuffer);
//     fileWriter.end();
//   }
// });
