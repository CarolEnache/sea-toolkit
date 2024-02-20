// So let's start from the data
// To import data we use the app storage
// import storage from './utils/dataStorage';
import { oecdCoeficients } from './utils/oecdCoeficients';

/**
 *  Tables in the spreadsheet
 * 
Cover 👀 End User Input
AlloySt_FU ❌ Unused / Hidden
Batt_FU ❌ Unused / Hidden
Chemicals_FU ❌ Unused / Hidden
Copper production ❌ Unused / Hidden
Income ❌ Unused / Hidden
LME_Warehouses ❌ Unused / Hidden
NiBase_FU ❌ Unused / Hidden
Ni_Market_Prices ❌ Unused / Hidden
SS_Use ❌ Unused / Hidden
STST_FU ❌ Unused / Hidden
Scrap_Ratios ❌ Unused / Hidden
Auxiliary ✅ Constants / Config
❌ Co_MSR_Raw_Data 📓
❌ Co_MSR ✅ Columns are renamed from Co_MSR_Raw_Data; Summed then  filtered
    # of companies                                = Establishments
    Production (kt)                               = Production (kt)
    Co-related USD$ ml/t Revenue                  = Output
    Total Employment attributed to cobalt         = Employees
    Employment Cost USD$ ml                       = Wages and salaries
    R&D Expenditure (Expansion Capex, $USD ml)    = R&D
    Co-Related Value Added USD$ ml                = Value Added
❌ Co_End_Use_Distribution 📓✅ Takes (Year, First use, product), calcs %per 1stUse+Year, plans forecast
❌ Co_End_Use 📓✅ Takes (First Use, Region, Year), matches with Co_End_Use_Distribution;
❌     Calcs "Value addition at first use" which "Cobalt value used" decides if it's used... something like 1+(X/(1-X))
❌     Calcs the cobalt price * multiplier for End Uses
❌ Co_First_Use_Distribution 📓✅ Takes (product, year) data, calcs %per year, plans forecast (tons of usage)
❌ Co_First_Use 📓✅ Takes (country, year) data, matches with Co_First_Use_Distribution; Average per year per region; Calculates cobalt price (3 scenarios)
❌ Co_Recycling 🧧 
Cobalt prices 📓
OECD Employment 📓
OECD Income 📓
OECD Raw IO 📓
OECD pivot ✅ Pivot from OECD Raw IO
OECD inputs ✅ Filter & aggregate from OECD pivot
OECD Direct Requirements ✅ Normalising OECD inputs
❌ OECD Direct Requirements (Coeficients) ✅ Totals / Values ; Then take that % and do a matrix multiplaction with the industry matrix
OECD Identity Matrix ✅ Identity Matrix
OECD I-A ✅ Identity Matrix - OECD Direct Requirements
OECD Type I ✅ Leontief without Labour, using OECD I-A
OECD Type II ✅ Leontief with Labour, using OECD I-A
❌ OECD Coefficients 🧧 List of coeficients, from Type I, Tpye II and OECD Direct Requirements
UNIDO_MINSTAT_REV_4 📓
UNIDO - RECYCLING REV 3.1 📓
UNIDO 📓
❌ UNIDO 2 - Employees ✅ Pivot from UNIDO
❌ UNIDO 2 - Establishments ✅ Pivot from UNIDO
❌ UNIDO 2 - Output ✅ Pivot from UNIDO
❌ UNIDO 2 - Value added ✅ Pivot from UNIDO
❌ UNIDO 2 - Wages and salaries ✅ Pivot from UNIDO
❌ ❌ (1) ✅ Pivot from Establishments
❌ ❌ (11) ✅ Pivot from Employees
❌ ❌ (3) ✅ Pivot from value added
❌ ❌ (5) ✅ Pivot from wages and salaries
❌ ❌ (9) ✅ Pivot from Output
Roskill_IOModel ❌ Clone, unneeded
Roskill_IOModel_PIVOT 🔥
Footprint - Sectoral analysis 🔥
Report 👀 End User Report
*/

// Cover 👀: This is the data that will come from the form
export const formData = {
  asset_model: 'COBALT',
  asset_market: 'COBALT',
  asset_modes_value: 'Base product value + value addition',
  asset_modes_first_use: 'Average',
  asset_modes_end_use: 'Yes',
  asset_income_effects: 'Yes',
  asset_msr: 'All Products',
  asset_msr_start: 2022,
  asset_msr_end: 2030,
  asset_msr_products: 'All Products',
  economy_unido: 'UNIDO/REV4',
  economy_unido_start: 2010,
  economy_unido_end: 2021,
  economy_oecd: 'OECD/2015',
  economy_region: 'Global', // 'North America',
  // report_id: crypto.randomUUID(),
  report_compiler: 'Socio-Economic Analysis Toolkit',
  report_org: 'Cobalt Institute',
  report_copy: 'Socio-Economic Analyser',
  report_authors: 'Johann Wiebe, Carol Enache, Cesar Costas',
};

// And we have a utils that calculates the OECD stuff
const OECD = oecdCoeficients({
  selectedRegion: formData.economy_region,
//   source: formData.economy_oecd,
});
//// Breakdown of the OECD: Raw data, Convert Rows to Table (PIVOT), Filter & aggregate (INPUT), Normalise (Direct Requirements)
//// At direct requirements, build coeficients stuff which are the values / totals, then a matrix multiplication 
//// Apply leontief, using the type I and II build the coeficients page
// TODO: Run here the oecd.mjs move it to ts, export all the internal steps


// We need to calculate some pivot tables,
// so probably worth writing a util for that... is basically a reduce
// but also worth understanding if we need it, as then the "get data from pivot table"
// is used to extract individual data
// TODO: Calculate here the pivot tables for Unido and CO_MSR

// ----

//

// And that's how far I got going from A to Z.

// ----

// And this's how far I got going from Z to A.

// We need to be able to generate 15 scenarios
// [Low, Base, High] x [Value, Labour, Employees, Tax, Output]

// For each we need to calculate the:
// Direct effect, First round, Industrial support, Income effect
// for 5 steps in the chain:
// Mine, Refine, First use, End use, Recycling

// 15 scenarios, 20 sub-scenarios, that's 300 scenarios

// OECD provides industry relationships
// Unido provides employment and production figures
// CO_MSR provides costing

// And that's how far I got going from Z to A.


/*

const chainSteps = [Mine, Refine, First use, End use, Recycling];
const consumers = [Direct effect, First round, Industrial support, Income effect]
const variables = [Value, Labour, Employees, Tax, Output]
const proyection = [Low, Base, High]

for...of chainSteps
  for...of consumers
    for...of variables
      for...of proyection
        getTheValue(chainStep, consumer, variable, proyection);

 */
