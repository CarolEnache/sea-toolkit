import {
  CoEndUse,
  CoFirstUse,
  CoEndUseDistribution,
  CoFirstUseDistribution,
  MSRRawData,
  CoPrices,
} from "./dataStorage";
import {
  CoEndUseDistributionTitles,
  CoEndUseTitles,
  CoFirstUseDistributionTitles,
  CoFirstUseTitles,
} from "./types";
import { REGIONS, SETTINGS } from "./auxiliary";
import { HARDCODED_ValueAdditionAtFirstUse } from "./unido-dardcoded-footprint";
import { FORM_DATA } from "../constants";

const MAX_FORECASTING_YEAR = new Date("2030-01-01").getFullYear();

// TODO - Reach out to Johann to share the RAWdata for the CoEndUse, CoFirstUse
// TODO revisit this file to make the code DRY - essspecially - getEndUseDistribution and getFirstUseDistribution

const toAccumulatorKey = (...args: string[]) => args.join("-");

// TODO - investigate the memory licks
const getEndUseDistribution = () => {
  const commodityApplications = CoEndUseDistribution[0].slice(3); // TODO - replce slice with a way to map to the correct data in a more dynamic way
  const rows = CoEndUseDistribution.slice(1);
  const Products = new Set<string>();
  const ConsumerApplications = new Set<string>();
  const latestYearInAvailableData = Number(
    rows[rows.length - 1][CoFirstUseDistributionTitles.Year]
  );
  const totalByApplicationsAndYear = rows.reduce((accumulator, row) => {
    const ceva = {
      Product: `${row[CoEndUseDistributionTitles.CobaltProduct]}`,
      Year: `${row[CoEndUseDistributionTitles.Year]}`,
      Application: `${row[CoEndUseDistributionTitles.Application]}`,
    };
    Products.add(ceva.Product);
    ConsumerApplications.add(ceva.Application);
    // All the applications
    (commodityApplications as string[]).forEach((commodityApplication) => {
      const key = toAccumulatorKey(
        ceva.Application,
        ceva.Year,
        commodityApplication
      );
      accumulator[key] = accumulator[key] || 0;
      const value =
      /* @ts-ignore-next-line */
        Number(row[CoEndUseDistributionTitles[commodityApplication]]) || 0;
      accumulator[key] += value;
    });

    return accumulator;
  }, {} as Record<string, number>);

  const productDistributionNormalisedByYearAndProduct = rows.reduce(
    (accumulator, row) => {
      const ceva = {
        Product: `${row[CoEndUseDistributionTitles.CobaltProduct]}`,
        Year: Number(row[CoEndUseDistributionTitles.Year]),
        CommodityApplication: `${row[CoEndUseDistributionTitles.Application]}`,
      };
      commodityApplications.forEach((commodityApplicationRaw) => {
        const commodityApplication = `${commodityApplicationRaw}`;
        const year = `${ceva.Year}`;
        const key = toAccumulatorKey(
          ceva.CommodityApplication,
          year,
          ceva.Product
        );
        const totalKey = toAccumulatorKey(
          ceva.CommodityApplication,
          year,
          commodityApplication
        );
        const total = totalByApplicationsAndYear[totalKey];

        const value =
        /* @ts-ignore-next-line */
          Number(row[CoEndUseDistributionTitles[commodityApplication]]) || 0;
        accumulator[key] = accumulator[key] || ceva;
        const normalisedValue = value / total;
        accumulator[key][commodityApplication] =
          (accumulator[key][commodityApplication] || 0) +
          (normalisedValue || 0);
      });
      return accumulator;
    },
    {} as Record<string, Record<string, number>>
  );

  Products.forEach((product) => {
    ConsumerApplications.forEach((application) => {
      const referenceKey = toAccumulatorKey(
        application,
        `${latestYearInAvailableData}`,
        product
      );
      new Array(MAX_FORECASTING_YEAR - latestYearInAvailableData)
        .fill(1)
        .forEach((_a, index) => {
          const forecastedYear = latestYearInAvailableData + 1 + index;
          const key = toAccumulatorKey(
            application,
            `${forecastedYear}`,
            product
          );

          productDistributionNormalisedByYearAndProduct[key] = structuredClone(
            productDistributionNormalisedByYearAndProduct[referenceKey]
          );
          productDistributionNormalisedByYearAndProduct[key].Year =
            forecastedYear;
        });
    });
  });

  return productDistributionNormalisedByYearAndProduct;
};

const getFirstUseDistribution = () => {
  const consumerApplications = CoFirstUseDistribution[0].slice(2);
  const rows = CoFirstUseDistribution.slice(1);
  const Products = new Set<string>();
  const latestYearInAvailableData = Number(
    rows[rows.length - 1][CoFirstUseDistributionTitles.Year]
  );
  const totalByApplicationsAndYear = rows.reduce((accumulator, row) => {
    const ceva = {
      Product: `${row[CoFirstUseDistributionTitles.CobaltProduct]}`,
      Year: `${row[CoFirstUseDistributionTitles.Year]}`,
    };
    Products.add(ceva.Product);
    // All the applications
    (consumerApplications as string[]).forEach((consumerApplication) => {
      const key = toAccumulatorKey(ceva.Year, consumerApplication);
      accumulator[key] = accumulator[key] || 0;
      const value =
      /* @ts-ignore-next-line */
        Number(row[CoFirstUseDistributionTitles[consumerApplication]]) || 0;
      accumulator[key] += value;
    });

    return accumulator;
  }, {} as Record<string, number>);

  const productDistributionNormalisedByYearAndProduct = rows.reduce(
    (accumulator, row) => {
      const ceva = {
        Product: `${row[CoFirstUseDistributionTitles.CobaltProduct]}`,
        Year: Number(row[CoFirstUseDistributionTitles.Year]),
      };
      consumerApplications.forEach((consumerApplication) => {
        const key = toAccumulatorKey(`${ceva.Year}`, ceva.Product);
        const totalKey = toAccumulatorKey(
          `${ceva.Year}`,
          `${consumerApplication}`
        );
        const total = totalByApplicationsAndYear[totalKey];

        const value =
        /* @ts-ignore-next-line */
          Number(row[CoFirstUseDistributionTitles[consumerApplication]]) || 0;
        accumulator[key] = accumulator[key] || ceva;
        const normalisedValue = value / total;
        accumulator[key][`${consumerApplication}`] =
          (accumulator[key][`${consumerApplication}`] || 0) +
          (normalisedValue || 0);
      });
      return accumulator;
    },
    {} as Record<string, Record<string, number>>
  );

  // TODO: Improve forecast, more or less they look good with this approach, we assume the same value as in 2021 for the rest of the years until 2030
  Products.forEach((product) => {
    const referenceKey = toAccumulatorKey(
      `${latestYearInAvailableData}`,
      product
    );
    new Array(MAX_FORECASTING_YEAR - latestYearInAvailableData)
      .fill(1)
      .forEach((_a, index) => {
        const forecastedYear = latestYearInAvailableData + 1 + index;
        const key = toAccumulatorKey(`${forecastedYear}`, product);

        productDistributionNormalisedByYearAndProduct[key] = structuredClone(
          productDistributionNormalisedByYearAndProduct[referenceKey]
        );
        productDistributionNormalisedByYearAndProduct[key].Year =
          forecastedYear;
      });
  });

  return productDistributionNormalisedByYearAndProduct;
};

const getPricingAndForecast = (): Record<string, any> => {
  const years = CoPrices[0].slice(1);
  const rows = CoPrices;
  const CURRENT_YEAR = new Date("2021-01-01").getFullYear();

  return years.map((year, index) => {
    const isForecast = Number(year) > CURRENT_YEAR;

    // TODO: Improve this mapping, not so hardcoded
    const D1 = Number(rows[0].slice(1)[index]);
    const D2 = Number(rows[1].slice(1)[index]);
    const D3 = Number(rows[2].slice(1)[index]);
    const D4 = Number(rows[3].slice(1)[index]);
    const D5 = Number(rows[4].slice(1)[index]);
    const D6 = Number(rows[5].slice(1)[index]);
    const D7 = Number(rows[6].slice(1)[index]);
    const D8 = Number(rows[7].slice(1)[index]);
    const D9 = Number(rows[8].slice(1)[index]);
    const D10 = Number(rows[9].slice(1)[index]);
    const D11 = Number(rows[10].slice(1)[index]);
    const D12 = Number(rows[11].slice(1)[index]);
    const D13 = Number(rows[12].slice(1)[index]);
    const D14 = Number(rows[13].slice(1)[index]);

    const rowYear = D1; // D1 // year
    const metal = D2; // D2
    const salts = (D7 + D12) / 2; // avg D7,D12
    const oxides = (D9 + D10) / 2; // avg D9,D10
    const carboxylates = (D6 + D7 + D8 + D9 + D10 + D11 + D12 + D13) / 8; // avg D6,D13
    const scrap = metal - D14; // D20 - D16
    const chemicals =
      (D4 + D5 + D6 + D7 + D8 + D9 + D10 + D11 + D12 + D13) / 10; // avg D4,D13

    const base = {
      metal,
      salts,
      oxides,
      carboxylates,
      scrap,
      chemicals,
    };
    let low, high;

    // TODO: Improve forecasting with a data-driven forecasting tool
    if (isForecast) {
      low = {
        metal: base.metal * 0.8,
        salts: base.salts * 0.8,
        oxides: base.oxides * 0.8,
        carboxylates: base.carboxylates * 0.8,
        scrap: base.scrap * 0.8,
        chemicals: base.chemicals * 0.8,
      };
      high = {
        metal: base.metal * 1.2,
        salts: base.salts * 1.2,
        oxides: base.oxides * 1.2,
        carboxylates: base.carboxylates * 1.2,
        scrap: base.scrap * 1.2,
        chemicals: base.chemicals * 1.2,
      };
    } else {
      low = base;
      high = base;
    }

    return {
      year: rowYear,
      low,
      base,
      high,
    };
  });
};

const getFirstUse = ({
  selectedRegion,
  selectedAssetMsrStart,
  selectedAssetMsrEnd,
}: {
  selectedRegion: string;
  selectedAssetMsrStart: number;
  selectedAssetMsrEnd: number;
}) => {
  const headerOffset = 2;
  const commodityApplications = CoFirstUse[0].slice(headerOffset) as string[];
  const rows = CoFirstUse.slice(1) as (string[] | number[])[];
  const firstUseDistribution = Object.values(getFirstUseDistribution());

  const firstUseWithProduct = rows.flatMap((row) => {
    const country = row[0];
    const year = row[1];

    return firstUseDistribution
      .filter((distribution) => distribution.Year === year)
      .map((distribution) => {
        const firstUseCombined = commodityApplications.reduce<
          Record<string, number | string>
        >((acc, header, index) => {
          acc[header] =
            Number(row[index + headerOffset]) * distribution[header];

          return acc;
        }, {});

        firstUseCombined.Country = country;
        firstUseCombined.Year = year;
        firstUseCombined.Product = distribution.Product;

        return firstUseCombined;
      });
  });

  const pricing = getPricingAndForecast();

  const firstUseWithProductAndForecast = firstUseWithProduct.flatMap(
    (product) => {
      const forecastType = ["low", "base", "high"];
      const currentYearForecast = pricing.find(
        (forecast: { year: string | number }) => forecast.year === product.Year
      );
      return forecastType.map((type: string) => {
        const price =
          currentYearForecast[type][`${product.Product}`.toLowerCase()];

        return Object.keys(product).reduce<Record<string, string | number>>(
          (acc, curr) => {
            if (!["Product", "Year", "Country"].includes(curr)) {
              acc[curr] = Number(product[curr]) * price;
            } else {
              acc[curr] = product[curr];
            }
            return acc;
          },
          { forecastType: type }
        );
      });
    }
  );

  const averageOfTonnes = firstUseWithProductAndForecast
    .filter(
      (current) =>
        current.Country === selectedRegion.toLocaleUpperCase() &&
        Number(current.Year) >= selectedAssetMsrStart &&
        Number(current.Year) <= selectedAssetMsrEnd
    )
    .reduce(
      (acc, curr) => {
        commodityApplications.forEach((application) => {
          // @ts-ignore
          acc[curr.forecastType][application] =
            // @ts-ignore
            curr[application] /
              (selectedAssetMsrEnd - selectedAssetMsrStart + 1) +
            // @ts-ignore
            (acc[curr.forecastType][application] || 0);
        });

        return acc;
      },
      { high: {}, base: {}, low: {} }
    );

  return {
    averageOfTonnes,
    firstUseWithProductAndForecast,
  };
};

const getEndUse = ({
  selectedRegion,
  selectedAssetMsrStart,
  selectedAssetMsrEnd,
}: {
  selectedRegion: string;
  selectedAssetMsrStart: number;
  selectedAssetMsrEnd: number;
}) => {
  const headerOffset = 3;
  const consumerApplications = CoEndUse[0].slice(headerOffset) as string[];
  const rows = CoEndUse.slice(1) as (string[] | number[])[];
  const endUseDistribution = Object.values(getEndUseDistribution());

  const endUseWithProduct = rows.flatMap((row) => {
    const commodityApplication = row[0];
    const country = row[1];
    const year = row[2];

    return endUseDistribution
      .filter(
        (distribution) =>
          distribution.Year === year &&
          commodityApplication === distribution.CommodityApplication
      )
      .map((distribution) => {
        const endUseCombined = consumerApplications.reduce<
          Record<string, number | string>
        >((acc, header, index) => {
          acc[header] =
            Number(row[index + headerOffset]) * distribution[header];

          return acc;
        }, {});

        endUseCombined.Country = country;
        endUseCombined.Year = year;
        endUseCombined.Product = distribution.Product;
        endUseCombined.CommodityApplication = commodityApplication;

        return endUseCombined;
      });
  });

  const pricing = getPricingAndForecast();

  const endUseWithProductAndForecast = endUseWithProduct.flatMap((product) => {
    const forecastType = ["low", "base", "high"];
    const currentYearForecast = pricing.find(
      (forecast: { year: string | number }) => forecast.year === product.Year
    );
    return forecastType.map((type: string) => {
      const price =
        currentYearForecast[type][`${product.Product}`.toLowerCase()];

      return Object.keys(product).reduce<Record<string, string | number>>(
        (acc, curr) => {
          if (
            !["Product", "Year", "Country", "CommodityApplication"].includes(
              curr
            )
          ) {
            acc[curr] =
              Number(product[curr]) *
              price *
              HARDCODED_ValueAdditionAtFirstUse[product.CommodityApplication];
          } else {
            acc[curr] = product[curr];
          }
          return acc;
        },
        { forecastType: type }
      );
    });
  });

  const averageOfTonnes = endUseWithProductAndForecast
    .filter(
      (current) =>
        current.Country === selectedRegion.toLocaleUpperCase() &&
        Number(current.Year) >= selectedAssetMsrStart &&
        Number(current.Year) <= selectedAssetMsrEnd
    )
    .reduce(
      (acc, curr) => {
        consumerApplications.forEach((application) => {
          // @ts-ignore
          acc[curr.forecastType][application] =
            // @ts-ignore
            curr[application] /
              (selectedAssetMsrEnd - selectedAssetMsrStart + 1) +
            // @ts-ignore
            (acc[curr.forecastType][application] || 0);
        });

        return acc;
      },
      { high: {}, base: {}, low: {} }
    );

  return {
    averageOfTonnes,
    endUseWithProductAndForecast, // with an error of max 1% 
  };
};


export const msr = ({
  selectedRegion = FORM_DATA.selectedRegion,
  selectedAssetMsrStart = FORM_DATA.selectedAssetMsrStart,
  selectedAssetMsrEnd = FORM_DATA.selectedAssetMsrEnd,
} = {}) => {
  // REGION

  // CALC

  // CoEndUseTitles
  // CoEndUseDistributionTitles
  // CoFirstUseTitles
  // CoFirstUseDistributionTitles
  return {
    // CoEndUse: CoEndUse[0].slice(3),
    //   CoEndUse: CoEndUse[0],
    // CoFirstUse: CoFirstUse[0].slice(2),
    // CoFirstUse: getFirstUse({
    //   selectedRegion,
    //   selectedAssetMsrStart,
    //   selectedAssetMsrEnd,
    // }),
    CoEndUse: getEndUse({
      selectedRegion,
      selectedAssetMsrStart,
      selectedAssetMsrEnd,
    }),
    // CoEndUseDistribution: getEndUseDistribution(),
    // CoFirstUseDistribution: getFirstUseDistribution(),
    //   MSRRawData: ,
  };
};
