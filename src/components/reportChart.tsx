// components/MyChart.js
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { EconomicParameterValues } from "@/app/generate-report/page";
import {
  EconomicFactors,
  ForecastingGroup,
  ManufacturingStage,
  RegionalReport,
} from "@/server/holistic-approach/report.types";

Chart.register(zoomPlugin);

type chartProps = {
  report: RegionalReport;
  economicParamKey: EconomicParameterValues;
  chartColors: {
    HIGH: string;
    BASE: string;
    LOW: string;
  };
};

const convertStringDataToNumber = (data: string[]): number[] => {
  return data.map((value) => {
    if (value.includes("%")) return Number(value.replace("%", ""));
    if (value === "") return 0;
  }) as number[];
};

const ReportChart = ({ report, economicParamKey, chartColors }: chartProps) => {
  const dates = Object.keys(
    report[economicParamKey].BASE.Change["Direct Applications"]
  );
  const economicFactors = Object.keys(
    report[economicParamKey].BASE
  ) as EconomicFactors[];

  const manufacturingStages = Object.keys(
    report[economicParamKey].BASE[economicFactors[0]]
  ) as ManufacturingStage[];

  const [indexDate, setIndexDate] = useState(0);
  const [selectedManufacturingStages, setSelectedManufacturingStages] =
    useState([manufacturingStages[0]]);
  const chartRef = useRef<any>(null);

  const handleStageToggle = (stage: ManufacturingStage) => {
    setSelectedManufacturingStages((prevStages) => {
      if (!prevStages.includes(stage)) {
        return [...prevStages, stage];
      } else {
        return prevStages.filter((va) => va !== stage);
      }
    });
  };

  useEffect(() => {
    if (chartRef.current) {
      const labels = manufacturingStages.filter((stage) =>
        selectedManufacturingStages?.includes(stage)
      );

      const extractData = (forecastingGroup: ForecastingGroup): number[][] => {
        return economicFactors.map((factor) => {
          const dataPoints = report[economicParamKey][forecastingGroup][factor];
          return labels.map((label) => {
            let data = Object.values(dataPoints[label]) as string[] | number[];

            //if data is string convert to number
            if (typeof data[0] === "string") {
              data = convertStringDataToNumber(data as string[]) as number[];
            }

            return data[indexDate] as number;
          });
        });
      };

      const forecastingGroup = Object.keys(chartColors) as ForecastingGroup[];

      let datasets = economicFactors
        .map((factor, index) => {
          return forecastingGroup.map((keyColor) => ({
            label: `${keyColor} - ${factor} ${factor === "Change" ? "%" : ""}`,
            data: extractData(ForecastingGroup[keyColor])[index],
            backgroundColor: chartColors[keyColor],
            borderColor: chartColors.BASE,
            borderWidth: 1,
            borderRadius: 2,
          }));
        })
        .flat();

      const ctx = chartRef.current.getContext("2d");

      const chart = new Chart(ctx, {
        type: "bar", // ou 'line', 'pie', etc.
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          plugins: {
            tooltip: {
              titleFont: {
                size: 14,
                weight: "bold",
              },
              bodyFont: {
                size: 12,
              },
              callbacks: {
                title: function (tooltipItems) {
                  const title = tooltipItems[0].dataset.label;
                  if (title) return title.replace("%", "");
                },
                label: function (tooltipItem) {
                  const label = tooltipItem?.dataset.label;
                  return `Value: ${tooltipItem.raw} ${
                    label && label.includes("%") ? "%" : ""
                  }`;
                },
              },
            },
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
              labels: {
                // Custom filter function to show only specific datasets
                filter: function (legendItem, chartData) {
                  // Show only the first three datasets in the legend
                  return legendItem.datasetIndex < 3;
                },
              },
            },
          },
          interaction: {
            intersect: true,
          },
          scales: {
            y: {
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
  }, [report, indexDate, selectedManufacturingStages]);

  // h-[85%]
  return (
    <div className="flex flex-col w-full  h-full min-h-[80%]  min-w-full  relative ">
      <div className=" flex justify-between mb-3">
        <h3 className="text-2xl font-bold text-secondary ">
          {economicParamKey}
        </h3>

        <div className="flex gap-2 ">
          {dates.map((date, i) => (
            <button
              key={i}
              className={`${
                indexDate === i
                  ? "bg-primary text-white"
                  : "bg-white text-secondary/50 border-secondary/"
              }  py-1.5 px-2 border y rounded-full shadow transition duration-200 ease-in-out transform hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
              onClick={() => {
                setIndexDate(i);
              }}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-primary/30 mb-3"></div>
      {/* DATES BUTTON  */}

      {/* ManufacturingStages TOGGLE BUTTONS  */}
      <div className="flex justify-center ">
        <div className="flex flex-wrap gap-2 mb-3">
          {manufacturingStages.map((stage, i) => (
            <button
              key={i}
              className={`${
                selectedManufacturingStages.includes(stage)
                  ? "bg-tertiary text-primary"
                  : "bg-white text-secondary/50 border-secondary/"
              } text-sm py-1.5 px-2 border  rounded-full shadow transition duration-200 ease-in-out transform hover:bg-tertiary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:ring-opacity-50`}
              onClick={() => handleStageToggle(stage)}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ReportChart;
