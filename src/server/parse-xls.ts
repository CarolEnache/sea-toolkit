/*
as we may need to parse more files in the future it's good to have a parser
this needs to:
*/
// load the xls library
// load the file from the arguments
// 
import XLSX from 'xlsx';
import readline from 'readline';
import fs from 'fs';
import { execSync } from 'child_process';

XLSX.set_fs(fs);

const testFallback = () => {
  console.log('\033[33m⚠️ You need to pass a valid file as an argument, using ./data/benchmark.xlsx for demo purposes.\033[0m\n');
  return './data/benchmark.xlsx';
}

const userInput = (() => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return (query: string) => new Promise((resolve) => rl.question(query, resolve));
})();

(async () => {
  console.clear();
  console.log('Parse-XLS util v0\n');

  const taskSetup = {
    selectedFile: process.argv[2] || testFallback(),
    outputFolder: './parsed-xls'
  }
  console.log(JSON.stringify(taskSetup, null, 2).replace('{\n', '\033[4m\033[1mTask Setup\033[0m\n\n').replace('\n}', '\n').replace(',\n', '\n').replaceAll('  "', '\033[1m').replaceAll('": "', '\033[0m\t"'));

  console.log(`Reading ${taskSetup.selectedFile}...`);
  // get the sheets, prompt which sheets to parse
  const workbook = XLSX.readFile(taskSetup.selectedFile);

  const nameList = await userInput(`\nWhich sheet do you want to parse? (comma separated for multiple sheets)\n${workbook.SheetNames}\n\n> `) as string;
  console.log('\r');

  // split by comma, iterate, check if valid sheetnames, and parse
  await Promise.all(nameList.split(',').map(async sheetName => {

    console.log(`Parsing ${sheetName}...`);
    const table = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    // save to filesystem
    // take the row 0, stringify, take the length of the string as the byte size of a row, divide the desired file size by this length, that's the number of rows per file
    const sizeOfRow = JSON.stringify(table[0]).length;
    const numRowsPerFile = 7000000 / sizeOfRow;
    // for...iterate until all rows are saved, name files with .part0.json names
    for (let i = 0; (i * numRowsPerFile) < table.length; i += 1) {
      const outputFile = `${taskSetup.outputFolder}/${sheetName}.part${i}.json`;
      console.log(`Saving ${outputFile}`);
      execSync(`mkdir -p ${taskSetup.outputFolder}`, { cwd: process.cwd() });
      fs.writeFileSync(outputFile, JSON.stringify(table.slice(
        (i) * numRowsPerFile,
        (i + 1) * numRowsPerFile
      )));
    }
  }));

  console.log('\nAll done ✨');
  process.exit(0);
})();

