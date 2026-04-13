'use client';

import React from 'react';

export default function Story(): React.JSX.Element {
  return (
    <div
      id="historia"
      className="hz-margin my-16 md:my-[10vh] flex flex-col md:flex-row pt-16 md:pt-[10vh]"
    >
      <h3 className="reveal w-full md:w-[40vw] text-[1.5rem] md:text-[1.8rem] font-semibold tracking-wide">
        A nossa <br />
        História de amor
      </h3>
      <p className="text reveal w-full md:w-[40vw] text-justify text-base leading-7 md:text-[1rem] md:leading-6 tracking-normal mt-4 md:mt-0">
        Aqui a gente põe um textão bem bonito.
      </p>
    </div>
  );
}
