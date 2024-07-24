// components/MyChart.js
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { EconomicParameterValues } from "@/app/generate-report/[id]/page";
import {
  EconomicFactors,
  ForecastingGroup,
  ManufacturingStage,
  RegionalReport,
} from "@/server/holistic-approach/report.types";

Chart.register(zoomPlugin);

const highColor = "#012d49";
const baseColor = "#53709D";
const lowColor = "#F1FAFF";

type chartProps = {
  report: RegionalReport;
  economicParamKey: EconomicParameterValues;
};

const convertStringDataToNumber = (data: string[]): number[] => {
  return data.map((value) => {
    if (value.includes("%")) return Number(value.replace("%", ""));
    if (value === "") return 0;
  }) as number[];
};

const ReportChart = ({ report, economicParamKey }: chartProps) => {
  const dates = Object.keys(
    report[economicParamKey].BASE.Change["Direct Applications"]
  );
  const categories__ = Object.keys(
    report[economicParamKey].BASE
  ) as EconomicFactors[];

  const manufacturingStages__ = Object.keys(
    report[economicParamKey].BASE[categories__[0]]
  ) as ManufacturingStage[];

  const [indexDate, setIndexDate] = useState(0);
  const [selectedManufacturingStages, setSelectedManufacturingStages] =
    useState([manufacturingStages__[0]]);
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
      const categories = Object.keys(
        report[economicParamKey].BASE
      ) as EconomicFactors[];

      const manufacturingStages = Object.keys(
        report[economicParamKey].BASE[categories[0]]
      ) as ManufacturingStage[];

      const labels = manufacturingStages.filter((stage) =>
        selectedManufacturingStages?.includes(stage)
      );

      const extractData = (scenario: ForecastingGroup) => {
        return categories.map((category) => {
          const dataPoints = report[economicParamKey][scenario][category];
          return labels.map((label) => {
            let data = Object.values(dataPoints[label]);

            //if data is string convert to number
            if (data.includes("")) {
              data = convertStringDataToNumber(data);
            }

            return data[indexDate];
          });
        });
      };

      const baseData = extractData(ForecastingGroup.BASE);
      const lowData = extractData(ForecastingGroup.LOW);
      const highData = extractData(ForecastingGroup.HIGH);

      let datasets = categories
        .map((category, index) => {
          return [
            {
              label: `LOW - ${category} ${category === "Change" ? "%" : ""}`,
              data: lowData[index],
              backgroundColor: lowColor,
              borderColor: lowColor,
              borderWidth: 1,
            },
            {
              label: `BASE - ${category} ${category === "Change" ? "%" : ""}`,
              data: baseData[index],
              backgroundColor: baseColor,
              borderColor: baseColor,
              borderWidth: 1,
            },
            {
              label: `HIGH - ${category} ${category === "Change" ? "%" : ""}`,
              data: highData[index],
              backgroundColor: highColor,
              borderColor: highColor,
              borderWidth: 1,
            },
          ];
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
  }, [report, economicParamKey, indexDate, selectedManufacturingStages]);

  // h-[85%]
  return (
    <div className="flex flex-col w-full  h-full min-h-[80%]  min-w-full  relative pt-4 ">
      <div className="flex gap-3 absolute -top-12  right-0">
        {dates.map((date, i) => (
          <button
            key={i}
            className={`${
              indexDate === i
                ? "bg-primary text-white"
                : "bg-white text-secondary/50 border-secondary/"
            } py-1.5 px-2 border y rounded-full shadow transition duration-200 ease-in-out transform hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
            onClick={() => {
              setIndexDate(i);
            }}
          >
            {date}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {manufacturingStages__.map((stage, i) => (
          <button
            key={i}
            className={`${
              selectedManufacturingStages.includes(stage)
                ? "bg-tertiary text-primary"
                : "bg-white text-secondary/50 border-secondary/"
            } py-1.5 px-2 border  rounded-full shadow transition duration-200 ease-in-out transform hover:bg-tertiary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-opacity-50`}
            onClick={() => handleStageToggle(stage)}
          >
            {stage}
          </button>
        ))}
      </div>

      <div></div>

      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ReportChart;
