
import React from "react";

export default function Card({ preHeader, header, description, svg, children}) {
  return (
    <section className="">
      <h4 className="">
        {preHeader}
      </h4>
      <h1 className="">
        {header}
      </h1>
      {description?.map((item, index) => {
        return (
          <p key={index} className=""> {item.paragraph}</p>
        )
      })
      }
      {svg && ( 
        <div
          style={{ 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(${svg})`
          }}
          className=""></div>
        )}
      <div className="">
        {children}
      </div>
    </section>
  );
}
