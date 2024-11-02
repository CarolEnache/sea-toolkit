"use client";

import Image from "next/image";

import { NextUIProvider, Spacer } from "@nextui-org/react";
// import Navbar from "@/components/Navbar";
import PageSection from "@/components/section";
import Navbar from "@/components/navbar";

const featuresList = [
  {
    header: "Instant Report Generation",
    svg: "/data-driven.svg",
    description:
      "Empowers users to create detailed socio-economic reports instantly, offering insights into value addition, labor income, tax contributions, and employment impacts.",
  },
  {
    header: "Data-Driven Accuracy",
    svg: "/data-driven.svg",
    description:
      "Built on a foundation of robust data and solid calculations, ensuring reliable and precise analysis.",
  },
  {
    header: "Automated and Flexible",
    svg: "/automated.svg",
    description:
      "Combines automated processes with the flexibility to adjust parameters, ensuring error-free outputs while accommodating specific analysis needs.",
  },
  {
    header: "Interactive Dashboards",
    svg: "/insight.svg",
    description:
      "Features user-friendly dashboards with visuals like charts and tables for intuitive understanding and effective communication.",
  },
  {
    header: "Comprehensive Analysis",
    svg: "/target.svg",
    description:
      "Delivers in-depth insights, allowing users to explore every stage of the value chain, assess economic effects, and understand the broader impact on societies.",
  },
];

export default function Home() {
  return (
    <NextUIProvider>
      <>
        <Navbar />
        <div className="w-screen h-screen flex flex-col items-center">
          <PageSection
            preHeader="Impact Assessment Modelling"
            header="Dynamic Socio-Economic Analysis Platform
            "
            description={[
              {
                paragraph:
                  "Our platform revolutionizes socio-economic analysis by enabling users to dynamically generate accurate reports on the fly. It stands as a pioneering tool that allows for instant, data-driven insights into the economic impacts of various sectors. With a focus on precision and speed, our tool processes vast datasets to deliver detailed, customizable reports tailored to specific commodities, industries, or economic activities.",
              },
              {
                paragraph:
                  "We built the first Socio Economic Analysis model that provides insights in the economic impact for a any commodity. It displays the interactive connections between various sectors and addresses their input and output factors, measuring the value add.",
              },
            ]}
            svg="/person.svg"
          />
          <PageSection
            className="bg-tertiary"
            preHeader="Core Features"
            header="Designed for versatility and precision

            "
            description={[
              {
                paragraph:
                  "This platform is not merely a reporting tool; it is a comprehensive solution that transforms socio-economic data into actionable insights, enabling users to make informed decisions based on robust, data-driven analyses. Its user-friendly interface, combined with powerful analytical capabilities, makes it an indispensable tool for researchers, policymakers, and businesses aiming to understand and communicate the complex economic impacts of various sectors and activities.",
              },
            ]}
            hasCenteredText
          >
            {featuresList.map(({ description, header, svg }) => (
              <div
                className="flex flex-col items-center col-span-4 text-secondary translate-wider font-extralight text-center"
                key={header}
              >
                <Image
                  src={svg}
                  alt={""}
                  width={100}
                  height={100}
                  className="col-span-4"
                  style={{
                    width: "200px",
                    height: "auto",
                  }}
                />
                <h5 className="text-2xl text-secondary font-bold tracking-tight leading-tight m-0">
                  {header}
                </h5>
                <p>{description}</p>
              </div>
            ))}
            <Spacer y={8} />
          </PageSection>
        </div>
      </>
    </NextUIProvider>
  );
}
