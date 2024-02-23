import type { NextApiRequest, NextApiResponse } from "next";
import fs from 'node:fs/promises';
import path from 'node:path';

import { generateReport } from "./report-output";
import { formData } from "./hardcoded-mocks";
import { getProductsFrom, getRegionsFrom } from "./selectors";
import { oecdCoeficients } from "../utils/oecdCoeficients";
import { msr } from "../utils/msr";
import { unido } from "../utils/unido";

// #region getters
export const getMarketSources = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  response
    .status(200)
    .json(["COBALT | Enache-Costas-2023", "!NICKEL", "!COPPER", "!HYDROGEN"]);
};
export const getModelSources = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  response
    .status(200)
    .json(["COBALT | Wiebe-2019", "!NICKEL", "!COPPER", "!HYDROGEN"]);
};
export const getManufacturingSources = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  response.status(200).json(["COBALT INSTITUTE 2019"]);
};
export const getIndustryMatrixSources = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  response.status(200).json(["UNIDO | Wiebe 2015"]);
};
export const getIndustryMetricSources = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  response.status(200).json(["OECD | Wiebe 2015"]);
};
// #endregion

// #region setters
export const uploadIndustryMatrixSource = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  // Somethig to handle the request, receive the new file, etc... then process it
  // First extract the regions
  const regions = getRegionsFrom('this (not implemented) expects an id, but for this use case should expect OECD data');
  // Now we have to produce the output of this model for each region, then store it so it can be accessed fast
  for (const selectedRegion of regions) {
    console.log('Calculating', selectedRegion);
    const result = oecdCoeficients({ selectedRegion });
    await fs.writeFile(path.join(import.meta.url, `../cache/oecd:${selectedRegion.toLowerCase().replaceAll(/[^a-z]+/gi, '-')}.json`).replace('file:', ''), JSON.stringify(result), 'utf8');
  }
};
export const uploadManufacturingSource = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  // Somethig to handle the request, receive the new file, etc... then process it
  // First extract the regions
  const regions = getRegionsFrom('this (not implemented) expects an id, but for this use case should expect OECD data');
  // Now we have to produce the output of this model for each region, then store it so it can be accessed fast
  for (const selectedRegion of regions) {
    console.log('Calculating', selectedRegion);
    const result = msr({ selectedRegion });
    await fs.writeFile(path.join(import.meta.url, `../cache/msr:${selectedRegion.toLowerCase().replaceAll(/[^a-z]+/gi, '-')}.json`).replace('file:', ''), JSON.stringify(result), 'utf8');
  }
};
export const uploadIndustryMetricSource = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  // Somethig to handle the request, receive the new file, etc... then process it
  // First extract the regions
  // Now we have to produce the output of this model for each region, then store it so it can be accessed fast
    const result = unido();
    await fs.writeFile(path.join(import.meta.url, `../cache/unido.json`).replace('file:', ''), JSON.stringify(result), 'utf8');
};
// #endregion

// #region event handlers
export const handleIndustryMatrixSourceSelection = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const industryMatrixSources = request.body;
  response.status(200).json(getRegionsFrom(industryMatrixSources));
};
export const handleManufacturingSourceSelection = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const manufacturingSources = request.body;
  response.status(200).json(getProductsFrom(manufacturingSources));
};
export const handleFormRequest = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  // here to do whatever needed to parse the request
  // const formData = request...

  const report = await generateReport(formData);

  response.status(200).json(report);
};
// #endregion