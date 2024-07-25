// components/MyChart.js
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { SlSizeFullscreen } from "react-icons/sl";
import { SlSizeActual } from "react-icons/sl";
import {
  EconomicParameterValues,
  ForecastingGroupKey,
  HandleToggleDataArrayProps,
} from "@/app/generate-report/[id]/page";
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
  keysForecastingGroup: ForecastingGroupKey[];
  selectedForecastingGroup: ForecastingGroupKey[];
  handleToggleDataArray: HandleToggleDataArrayProps<any>;
  index: number;
  setIndexChartFullScreen: (index: number | null) => void;
  indexChartFullScreen: number | null;
};

const convertStringDataToNumber = (data: string[]): number[] => {
  return data.map((value) => {
    if (value.includes("%")) return Number(value.replace("%", ""));
    if (value === "") return 0;
  }) as number[];
};

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
}: chartProps) => {
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

      const forecastingGroup = keysForecastingGroup.filter((key) =>
        selectedForecastingGroup.includes(key)
      );

      const datasets = economicFactors
        .map((factor, index) => {
          return forecastingGroup.map((keyColor) => ({
            label: `${keyColor} - ${factor} ${factor === "Change" ? "%" : ""}`,
            data: extractData(ForecastingGroup[keyColor])[index],
            backgroundColor: chartColors[keyColor],
            borderColor: chartColors.BASE,
            borderWidth: 1,
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
              // labels: {
              //   // Custom filter function to show only specific datasets
              //   filter: function (legendItem, chartData) {
              //     // Show only the first three datasets in the legend
              //     return legendItem.datasetIndex < 3;
              //   },
              // },
            },
          },
          interaction: {
            intersect: true,
          },
          scales: {
            x: {
              beginAtZero: true,
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

  // h-[85%]
  return (
    <div
      className={`flex flex-col w-full h-full min-w-full relative ${
        indexChartFullScreen === index ? "min-h-[100%]" : "min-h-[80%]"
      } `}
    >
      <div className=" flex justify-between mb-4">
        {/* TITLE */}
        <h3 className="text-2xl font-bold text-secondary ">
          {economicParamKey}
        </h3>

        <div className="flex  md:gap-10">
          {/* DATES BUTTON  */}
          <div className="flex gap-2">
            {dates.map((date, i) => (
              <button
                key={i}
                className={`${
                  indexDate === i
                    ? "bg-primary text-white"
                    : "bg-white text-secondary/50 border-secondary/10"
                }  buttonChart hover:bg-primary hover:text-white`}
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
            className="hidden md:block"
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
        <div className="flex flex-wrap gap-2 mb-3">
          {manufacturingStages.map((stage, i) => (
            <button
              key={i}
              className={`${
                selectedManufacturingStages.includes(stage)
                  ? "bg-tertiary text-primary"
                  : "bg-white text-secondary/50 border-secondary/10"
              } buttonChart hover:bg-tertiary hover:text-primary text-xs`}
              onClick={() =>
                handleToggleDataArray(stage, setSelectedManufacturingStages)
              }
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
