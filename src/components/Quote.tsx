'use client';

import React from 'react';

export default function Quote(): React.JSX.Element {
  return (
    <div className="quote reveal my-16 md:my-[10vh] text-center px-4">
      <h1 className="mx-auto text-2xl md:text-[2rem] leading-8 md:leading-[2rem] max-w-prose">
        &ldquo;Desfrute a vida com a sua amada esposa todos os dias da sua vida&rdquo;.
      </h1>
      <div className="author text font-sans mt-5 mb-[10vh]">Eclesiastes 9:9</div>
    </div>
  );
}
