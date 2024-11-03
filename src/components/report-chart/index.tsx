"use client";

// components/MyChart.js
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

import { SlSizeFullscreen } from "react-icons/sl";
import { SlSizeActual } from "react-icons/sl";

import {
  Change,
  EconomicFactors,
  EconomicFactorsValuesEnum,
  ForecastingGroup,
  ForecastingGroupKey,
  ManufacturingStage,
} from "@/server/holistic-approach/report.types";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { ChartProps } from "@/types/front/report";

const ReportChart = ({
  report,
  economicParamKey,
  chartColors,
  keysForecastingGroup,
  selectedForecastingGroup,
  handleToggleDataArray,
  index,
  indexChartFullScreen,
  setIndexChartFullScreen,
  dates,
}: ChartProps) => {
  const economicFactors = Object.keys(
    report[economicParamKey].BASE
  ) as EconomicFactors[];
  const economicFactorsWithoutTotalAndChange = economicFactors.filter(
    (factor) => factor !== "Change" && factor !== "Total"
  );
  const manufacturingStages = Object.keys(
    report[economicParamKey].BASE[economicFactors[0]]
  ) as ManufacturingStage[];

  const [indexDate, setIndexDate] = useState(0);

  const [changes, setChanges] = useState<Change[]>([]);

  const [selectedManufacturingStages, setSelectedManufacturingStages] =
    useState([manufacturingStages[0]]);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      const labels = manufacturingStages.filter((stage) =>
        selectedManufacturingStages?.includes(stage)
      );

      const extractData = (
        forecastingGroup: ForecastingGroup,
        economicFactorsKeys: EconomicFactorsValuesEnum[]
      ): number[][] => {
        return economicFactorsKeys.map((factor) => {
          const dataPoints = report[economicParamKey][forecastingGroup][factor];
          return labels.map((label) => {
            let data = Object.values(dataPoints[label]) as string[] | number[];

            return data[indexDate] as number;
          });
        });
      };

      const forecastingGroup = keysForecastingGroup.filter((key) =>
        selectedForecastingGroup.includes(key)
      );

      // TO SHOW CHANGE DATA IF SECOND DATE IS CHOOSED
      if (indexDate === 1) {
        const changes = forecastingGroup.map((key) => {
          const change = {
            [key]: extractData(
              ForecastingGroup[key],
              economicFactors.filter((ec) => ec === "Change")
            )?.[0]?.[0],
          } as Change;
          return change;
        });
        setChanges(changes);
      } else {
        setChanges([]);
      }

      const labelsWithTotals = labels.map((label, index) => {
        let formatLabel = "Totals ( ";
        forecastingGroup.forEach((key, i) => {
          const total = extractData(ForecastingGroup[key], economicFactors)[3][
            index
          ];
          const change = extractData(
            ForecastingGroup[key],
            economicFactors.filter((ec) => ec === "Change")
          )?.[0]?.[0];
          return (formatLabel += `${key}:${total}${
            indexDate === 1 ? ` (+${change})` : ""
          }${i !== forecastingGroup.length - 1 ? " " : ""}`);
        });
        return (formatLabel += " )");
      });

      const datasets = economicFactorsWithoutTotalAndChange
        .map((factor, index) => {
          return forecastingGroup.map((keyColor) => ({
            label: `${keyColor} - ${factor}`,
            data: extractData(
              ForecastingGroup[keyColor],
              economicFactorsWithoutTotalAndChange
            )[index],
            backgroundColor: chartColors[keyColor],
            borderColor: chartColors.BASE,
            borderWidth: 1,
          }));
        })
        .flat();

      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // REFACTO THIS CODE NOT PERFECT
      const maxDataset = datasets.reduce(
        (max: any, dataset: any) => {
          const value = dataset.data[0];
          return value > max.maxValue ? { dataset, maxValue: value } : max;
        },
        { dataset: null, maxValue: -Infinity }
      ).dataset;

      const maxValue = maxDataset?.data;
      let addValue = 0;
      if (maxValue)
        if (maxValue < 1000) {
          addValue = 100;
        } else if (maxValue < 10000) {
          addValue = 500;
        } else if (maxValue < 20000) {
          addValue = 1000;
        } else {
          addValue = 2000;
        }
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      const ctx = chartRef.current.getContext("2d");

      const chart = new Chart(ctx, {
        type: "bar", // ou 'line', 'pie', etc.
        data: {
          labels: [""],
          datasets: datasets,
        },
        plugins: [ChartDataLabels],
        options: {
          plugins: {
            // datalabels: {
            //   anchor: "end",
            //   align: "end",
            //   offset: 0,
            //   font: {
            //     weight: "bold",
            //   },
            //   color: "green",
            // },

            datalabels: {
              labels: {
                name: {
                  align: "start",
                  anchor: "start",

                  padding: {
                    top: 10,
                  },
                  font: { size: 12, weight: 600 },

                  formatter: function (value, ctx) {
                    return ctx.chart.data.datasets[
                      ctx.datasetIndex
                    ].label?.split("-")[1];
                  },
                  display: function (context) {
                    let indexToShow = context.datasetIndex === 1;
                    if (datasets.length === 6) {
                      indexToShow =
                        context.datasetIndex === 1 ||
                        context.datasetIndex === 3 ||
                        context.datasetIndex === 5;
                    } else if (datasets.length === 9) {
                      indexToShow =
                        context.datasetIndex === 1 ||
                        context.datasetIndex === 4 ||
                        context.datasetIndex === 7;
                    } else if (datasets.length === 0) {
                      indexToShow = false;
                    }
                    return indexToShow;
                  },
                },
                value: {
                  align: "end",
                  anchor: "end",
                  color: "grey",
                  font: {
                    weight: 600,
                  },
                },
              },
            },

            tooltip: {
              titleFont: {
                size: 14,
                weight: "bold",
              },
              bodyFont: {
                size: 12,
              },
              callbacks: {
                label: function (tooltipItem) {
                  return `Value: ${tooltipItem.raw}`;
                },
                title: function (tooltipItems) {
                  const title = tooltipItems[0].dataset.label;
                  // if (title) return title.replace("%", "");
                  return title;
                },
              },
            },
            // uncomment to enable zoom (need config)
            // zoom: {
            //   zoom: {
            //     wheel: {
            //       enabled: true,
            //     },
            //     pinch: {
            //       enabled: true,
            //     },
            //     mode: "xy",
            //   },
            // },
            legend: {
              display: false,
              position: "bottom",
            },
          },

          interaction: {
            intersect: true,
          },
          scales: {
            x: {
              title: {
                display: true,
                text: labelsWithTotals[0],
                font: {
                  weight: 600,
                },
                padding: {
                  top: 5,
                },
              },
              ticks: {
                font: {
                  weight: 600,
                },
              },
              grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.2)",
              },
            },

            y: {
              max: Math.ceil(maxValue / 100) * 100 + addValue,
              ticks: {
                font: {
                  weight: 600,
                },
              },
              title: {
                display: true,
              },
              border: {
                dash: [5, 5],
                display: true,
              },
              grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
              },
              beginAtZero: true,
            },
          },
        },
      });
      return () => {
        chart.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    report,
    indexDate,
    selectedManufacturingStages,
    selectedForecastingGroup,
  ]);

  return (
    <>
      <div
        className={`flex flex-col w-full min-w-full relative ${
          indexChartFullScreen === index
            ? "min-h-[80%]  max-h-[20%] h-[5/6]"
            : "min-h-[100%] h-full "
        } `}
      >
        <div className=" flex justify-between mb-3">
          {/* TITLE */}
          <h3 className="text-2xl font-bold text-secondary ">
            {economicParamKey}
          </h3>

          <div className="flex gap-2 md:gap-10">
            {/* DATES BUTTON  */}
            <div className="flex gap-1 md:gap-2">
              {dates.map((date, i) => (
                <button
                  key={i}
                  className={`${
                    indexDate === i
                      ? "bg-primary text-white"
                      : "bg-white text-secondary/50 border-secondary/10"
                  }  buttonChart hover:bg-primary hover:text-white text-sm`}
                  onClick={() => {
                    setIndexDate(i);
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
            {/* TOGGLE SIZE BUTTON  */}
            <button
              className=" text-xs md:text-base "
              onClick={() => {
                if (
                  indexChartFullScreen !== null &&
                  indexChartFullScreen === index
                ) {
                  setIndexChartFullScreen(null);
                } else {
                  setIndexChartFullScreen(index);
                }
              }}
            >
              {indexChartFullScreen === index ? (
                <div className="p-2 hover:border-primary/50 border rounded-md border-secondary/50 active:scale-95 hover:bg-gray-50 transition duration-200 ">
                  <SlSizeActual className="text-secondary/50 hover:text-primary/50 " />
                </div>
              ) : (
                <div className="p-2 hover:text-primary/50 border rounded-md border-secondary/50 active:scale-95 hover:bg-gray-50 transition duration-200 ">
                  <SlSizeFullscreen className="text-secondary/50 hover:text-primary/50 " />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* ManufacturingStages TOGGLE BUTTONS  */}
        <div className="flex justify-center ">
          <div className="flex justify-center flex-wrap gap-2 mb-3">
            {manufacturingStages.map((stage, i) => (
              <button
                key={i}
                className={`${
                  selectedManufacturingStages.includes(stage)
                    ? "bg-tertiary text-primary"
                    : "bg-white text-secondary/50 border-secondary/10"
                } buttonChart hover:bg-tertiary hover:text-primary text-xs`}
                onClick={() => {
                  // handleToggleDataArray(stage, setSelectedManufacturingStages)
                  if (!selectedManufacturingStages.includes(stage))
                    setSelectedManufacturingStages([stage]);
                }}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <canvas ref={chartRef}></canvas>

        {/* CHANGES PERCENTAGE BETWEEN FIRST DATE AND SECOND LOW BASE HIGH  */}
        {changes.length > 0 && (
          <>
            <div className="flex  justify-center  w-full gap-2  ">
              {changes.map((change, index) => {
                const [key, value] = Object.entries(
                  change
                )[0] as ForecastingGroupKey[]; // NEED TO FIX THIS TYPE
                return (
                  <div
                    key={index}
                    className="bg-white flex items-center  px-4 mt-2 border-t border-gray-100 rounded-md shadow-md  py-2"
                  >
                    <div
                      className={`w-5 h-5 border rounded-full border-gray-300 mr-1`}
                      style={{ backgroundColor: chartColors[key] }}
                    ></div>

                    <div className="flex gap-1 items-center">
                      <div className="text-gray-700 text-xs font-semibold">
                        {key}
                      </div>

                      <div
                        className={` text-xs font-medium ${"text-green-500"}`}
                      >
                        +{value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReportChart;
