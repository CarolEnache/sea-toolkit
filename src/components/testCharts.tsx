// components/MyChart.js
import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration, ChartDataset } from "chart.js/auto";
import { i } from "mathjs";

const dataa: ChartDataset[] = [
  {
    label: "Dataset 1",
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: "rgb(75, 192, 192)",
    backgroundColor: "#3b82f6",
    tension: 0.1,
  },
];
const options: ChartConfiguration<"line"> = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Sample Chart",
    },
  },
};
const MyChart = ({ data, cat }) => {
  console.log(data);
  console.log(cat);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const goodData = data.Employment.BASE["Income Effect"]["Direct Applications"];

  useEffect(() => {
    if (chartRef.current) {
      const categories = Object.keys(data[cat].BASE);
      console.log("categories", categories);

      // Extraire dynamiquement les labels à partir des données
      const extractLabels = () => {
        const allLabels = new Set();
        categories.forEach((category) => {
          Object.keys(data[cat].BASE[category]).forEach((label) => {
            allLabels.add(label);
          });
        });
        return Array.from(allLabels);
      };

      const labels = extractLabels();

      const extractData = (scenario) => {
        return categories.map((category) => {
          const dataPoints = data[cat][scenario][category];
          console.log(dataPoints);
          return labels.map((label) => {
            console.log("a", Object.values(dataPoints[label]));
            return Object.values(dataPoints[label]);
          });
        });
      };

      const baseData = extractData("BASE");
      const lowData = extractData("LOW");
      const highData = extractData("HIGH");
      console.log("baseData", baseData);
      let datasets = categories
        .map((category, index) => {
          // console.log(highData[index]);
          return [
            {
              label: `BASE - ${category}`,
              data: baseData[index],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: `LOW - ${category}`,
              data: lowData[index],
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
            {
              label: `HIGH - ${category}`,
              data: highData[index],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ];
        })
        .flat();

      console.log("datasets", datasets);
      datasets = datasets.map((a) => {
        return { ...a, data: a.data.flatMap((d) => d) };
      });
      const ctx = chartRef.current.getContext("2d");

      // Détruire le graphique existant avant d'en créer un nouveau
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar", // ou 'line', 'pie', etc.
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          interaction: {
            intersect: false,
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 25000,
            },
          },
        },
      });
    }
  }, [data, options]);
  // h-[85%]
  return (
    <div className="flex w-full  h-full min-h-[80%]  min-w-full ">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MyChart;
