"use client";

import Image from "next/image";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";

export default function PageSection({
  preHeader,
  header,
  description,
  svg,
  children,
  className,
  hasCenteredText,
}: any) {
  return (
    <section
      className={`grid grid-cols-4 gap-4 my-4 pt-15 p-4 pb-0 ${
        className?.length ? className : ""
      }`}
    >
      <h4
        className={`col-span-4 uppercase text-md font-normal m-0 tracking-wider text-secondary ${
          hasCenteredText ? "text-center" : ""
        }`}
      >
        {preHeader}
      </h4>
      <h1
        className={`col-span-4 font-extrabold text-4xl text-secondary translate-wider ${
          hasCenteredText ? "text-center" : ""
        }`}
      >
        {header}
      </h1>
      {description?.map(
        (
          item: {
            paragraph:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | null
              | undefined;
          },
          index: Key | null | undefined
        ) => {
          return (
            <p
              key={index}
              className={`col-span-4 text-secondary translate-wider font-extralight ${
                hasCenteredText ? "text-center" : ""
              }`}
            >
              {" "}
              {item.paragraph}
            </p>
          );
        }
      )}
      {svg && (
        <Image
          src={svg}
          alt={""}
          width={100}
          height={100}
          className="col-span-4"
          style={{
            width: "100vw",
            height: "auto",
          }}
        />
      )}
      <div className="col-span-4 text-secondary translate-wider font-extralight text-center">
        {children}
      </div>
    </section>
  );
}
