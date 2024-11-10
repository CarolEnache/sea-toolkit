// For the Leontief calculation, these columns and rows are excluded
export const OECD_UNUSED_SECTOR_TO = [
  // 'HFCE',
  'NPISH',
  'GGFC',
  'GFCF',
  'INVNT',
  'CONS_ABR',
  'CONS_NONRES',
  'EXPO',
  'IMPO',
  'TOTAL',
];
// For the Leontief calculation, these columns and rows are excluded
export const OECD_UNUSED_SECTOR_FROM: string[] = [
  'OUTPUT',
  'VALU',
  'TXS_IMP_FNL',
  'TXS_INT_FNL',
  'TTL_INT_FNL',
];

export const FORM_DATA = {
  selectedAssetModel: 'COBALT',
  selectedAssetMarket: 'COBALT',
  selectedAssetModesValue: 'Base product value + value addition',
  selectedAssetModesFirstUse: 'Average',
  selectedAssetModesEndUse: 'Yes',
  selectedAssetIncomeEffects: 'Yes',
  selectedAssetMsr: 'All Products',
  selectedAssetMsrStart: 2022,
  selectedAssetMsrEnd: 2030,
  selectedAssetMsrProducts: 'All Products',
  selectedEconomyUnido: 'UNIDO/REV4',
  selectedEconomyUnidoStart: 2010,
  selectedEconomyUnidoEnd: 2021,
  selectedEconomyOecd: 'OECD/2015',
  selectedRegion: 'Europe', // 'North America',
  // generatedReportId: crypto.randomUUID(),
  selectedReportCompiler: 'Socio-Economic Analysis Toolkit',
  selectedReportOrg: 'Cobalt Institute',
  selectedReportCopy: 'Socio-Economic Analyser',
  selectedReportAuthors: 'Johann Wiebe, Carol Enache, Cesar Costas',
};

// TODO: COBALT_HARDCODED_MODEL | Model to use in the footprint, these are the ISIC codes to iterate for Unido
export const COBALT_HARDCODED_MODEL = [
  { OECD: 'D20T21', ISIC: '2029', weight: 0.2 },
  { OECD: 'D20T21', ISIC: '2211', weight: 1 },
  { OECD: 'D27', ISIC: '2720', weight: 1 },
  { OECD: 'D10T12', ISIC: '1080', weight: 1 },
  { OECD: 'D35T39', ISIC: '352', weight: 1 },
  { OECD: 'D35T39', ISIC: '352', weight: 1 },
  { OECD: 'D20T21', ISIC: '2100', weight: 1 },
  { OECD: 'D25', ISIC: '2593', weight: 0.45 },
  { OECD: 'D20T21', ISIC: '2029', weight: 0.35 },
  { OECD: 'D20T21', ISIC: '2029', weight: 0.45 },
  { OECD: 'D20T21', ISIC: '2022', weight: 1 },
  { OECD: 'D26', ISIC: '2610', weight: 1 },
  { OECD: 'D25', ISIC: '2599', weight: 1 },
  { OECD: 'D24', ISIC: '2420', weight: 1 },
  { OECD: 'D20T21', ISIC: '2011', weight: 0.75 },
  { OECD: 'D25', ISIC: '2592', weight: 1 },
  { OECD: 'D26', ISIC: '2640', weight: 1 },
  { OECD: 'D27', ISIC: '2790', weight: 1 },
  { OECD: 'D27', ISIC: '2710', weight: 0.35 },
  { OECD: 'D29', ISIC: '2910', weight: 1 },
  { OECD: 'D30', ISIC: '30', weight: 1 },
  { OECD: 'D07T08', ISIC: null, weight: 1 },
  { OECD: 'D41T43', ISIC: null, weight: 1 },
  { OECD: 'D19', ISIC: '06', weight: 1 },
  { OECD: 'D19', ISIC: '1920', weight: 1 },
  { OECD: 'D30', ISIC: '3030', weight: 1 },
  { OECD: 'D25', ISIC: '25', weight: 1 },
  { OECD: 'D20T21', ISIC: '20', weight: 1 },
  { OECD: 'D27', ISIC: '2750', weight: 0.75 },
  { OECD: 'D27', ISIC: '2710', weight: 0.65 },
  { OECD: 'D28', ISIC: '28', weight: 1 },
  { OECD: 'D20T21', ISIC: '2022', weight: 1 },
  { OECD: 'D20T21', ISIC: '2013', weight: 1 },
  { OECD: 'D01T03', ISIC: null, weight: 1 },
  { OECD: 'D35T39', ISIC: '38', weight: 1 },
  { OECD: 'D20T21', ISIC: '20', weight: 1 },
];
