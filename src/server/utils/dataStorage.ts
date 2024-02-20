// TODO: Import here all the data
import OECDRawPart0 from '../../data/OECD/2015/OECDRawIO.part0.json'
import OECDRawPart1 from '../../data/OECD/2015/OECDRawIO.part1.json'
import OECDRawPart2 from '../../data/OECD/2015/OECDRawIO.part2.json'
import OECDEmploymentPart0 from '../../data/OECD/2015/OECDEmployment.part0.json'


export const OECDRawInputOutput = [].concat(OECDRawPart0 as []).concat(OECDRawPart1 as []).concat(OECDRawPart2 as []);
export const OECDEmployment = [].concat(OECDEmploymentPart0 as []);
// export const OECDRawInputOutput = [
//   ["VAR","Variable","COU","Country","Region","ROW","From: (sector in row)","COL","To: (sector in column)","TIME","Time","Unit Code","Unit","PowerCode Code","PowerCode","Reference Period Code","Reference Period","Value","Flag Codes","Flags"],
//   ["DOMIMP","Domestic output and imports","MLT","Malta","Europe","CONS_ABR","Accomodation and food services","CONS_ABR","Mining and quarrying of non-energy producing products",2015,2015,"USD","US Dollar",6,"Millions",null,null,0.1],
//   ["DOMIMP","Domestic output and imports","CZE","Czech Republic","Europe","VALU","Other non-metallic mineral products","VALU","Mining and quarrying of non-energy producing products",2015,2015,"USD","US Dollar",6,"Millions",null,null,13.4],
//   ["DOMIMP","Domestic output and imports","CAN","Canada","North America","DOM_86T88","Human health and social work","D17T18","Paper products and printing",2015,2015,"USD","US Dollar",6,"Millions",null,null,21.9],
//   ["DOMIMP","Domestic output and imports","ESP","Spain","Europe","IMP_49T53","Transportation and storage","D19","Coke and refined petroleum products",2015,2015,"USD","US Dollar",6,"Millions",null,null,181.5],
//   ["DOMIMP","Domestic output and imports","TUN","Tunisia","Africa","IMP_26","Computer, electronic and optical products","D17T18","Paper products and printing",2015,2015,"USD","US Dollar",6,"Millions",null,null,1.1],
//   ["TTL","Domestic output and imports","VNM","VietNam","Asia, ex-China","DOM_64T66","Financial and insurance activities","D07T08","Mining and quarrying of non-energy producing products",2015,2015,"USD","US Dollar",6,"Millions",null,null,70.7],
//   ["TTL","Domestic output and imports","HRV","Croatia","Europe","DOM_22","Rubber and plastics products","D01T03","Agriculture, forestry and fishing",2015,2015,"USD","US Dollar",6,"Millions",null,null,2.9],
//   ["TTL","Domestic output and imports","ROU","Romania","Europe","IMP_35T39","Electricity, gas, water supply, sewerage, waste and remediation services","D05T06","Mining and extraction of energy producing products",2015,2015,"USD","US Dollar",6,"Millions",null,null,2.3],
//   ["VAL","Domestic output and imports","FIN","Finland","Europe","VALU","Real estate activities","VALU","Wood and products of wood and cork",2015,2015,"USD","US Dollar",6,"Millions",null,null,0.9],
//   ["VAL","Domestic output and imports","ITA","Italy","Europe","CONS_ABR","Computer, electronic and optical products","CONS_ABR","Mining and extraction of energy producing products",2015,2015,"USD","US Dollar",6,"Millions",null,null,7.3],
//   // expect
//   ["VAL","Domestic output and imports","SVK","Slovak Republic","Europe","DOM_22","Rubber and plastics products","D10T12","Food products, beverages and tobacco",2015,2015,"USD","US Dollar",6,"Millions",null,null,25.8],
//   ["VAL","Domestic output and imports","HUN","Hungary","Europe","IMP_19","Coke and refined petroleum products","D13T15","Textiles, wearing apparel, leather and related products",2015,2015,"USD","US Dollar",6,"Millions",null,null,3],
//   ["VAL","Domestic output and imports","MEX","Mexico","North America","IMP_28","Machinery and equipment n.e.c.","D07T08","Mining and quarrying of non-energy producing products",2015,2015,"USD","US Dollar",6,"Millions",null,null,199.1],
// ];
