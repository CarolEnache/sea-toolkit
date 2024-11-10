// This file is generated by tools/js/update-server-types.js, do not edit it manually.
export type SqlFiles = 'footprint.add_analyst-industries' | 'footprint.del_analyst-industries' | 'footprint.get_analyst-industries' | 'generic.del' | 'generic.get' | 'generic_mod' | 'msr.get_products' | 'msr_get_year_range' | 'nace.get_nace-codes' | 'oecd.get_oecd-codes' | 'oecd.get_regions' | 'report.add_request' | 'report.get_request' | 'report_add_result' | 'unido.get_isic-codes' | 'unido.pivot_region-year-isic' | 'unido_get_economic_factors' | 'unido_get_economic_parameters';
export type ParquetFiles = 'footprint.analyst-industries' | 'msr.cobalt-insitute_2019' | 'nace.europa-eu_2024' | 'oecd.wiebe_2008-2015' | 'oecd_employment.wiebe_2008-2015' | 'oecd_income.wiebe_2008-2015' | `report/${string}` | 'report.requests' | 'unido.wiebe_2008-2015';
export type OneOf<C, T extends C> = T;
