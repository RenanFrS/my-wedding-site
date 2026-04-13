'use client';

import React from 'react';

interface FooterProps {
  coupleName: string;
  groomFullName: string;
  brideFullName: string;
}

export default function Footer({
  coupleName,
  groomFullName,
  brideFullName,
}: FooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 md:mt-[20vh] w-full">
      {/* Conteúdo principal do footer */}
      <div className="bg-olive py-12 md:py-[10vh] px-6 md:px-[30px] text-center shadow-inner">
        <div className="max-w-[800px] mx-auto">
          <h2 className="title text-2xl md:text-[2.5rem] italic mb-8 font-normal">
            Com amor e Carinho
          </h2>
          <div className="flex flex-col items-center mb-8">
            <h2 className="name text-xl md:text-[2rem] font-medium my-2 tracking-wide">
              {groomFullName}
            </h2>
            <div className="ampersand text-[2.5rem] italic my-2">&</div>
            <h2 className="name text-xl md:text-[2rem] font-medium my-2 tracking-wide">
              {brideFullName}
            </h2>
          </div>
          <div className="heart-divider flex items-center justify-center my-6 w-full">
            <span className="left-line h-px w-[60px] md:w-[100px] bg-[#33290a]"></span>
            <i className="heart-icon text-[1.8rem] mx-[15px]">♥</i>
            <span className="right-line h-px w-[60px] md:w-[100px] bg-[#33290a]"></span>
          </div>
        </div>
      </div>
      
      {/* Barra de copyright */}
      <div className="bg-[#FFC885] py-6 px-6 md:px-[30px] text-center">
        <div className="max-w-[1200px] mx-auto text-[#6d4635] text-sm md:text-base">
          <p>
            © {currentYear}: {coupleName} - Todos os direitos reservados, Desenvolvido por:{' '}
            <a
              href="http://instagram.com/renanrocha.01/"
              className="text-[#ac5b30] font-semibold hover:underline transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              Renan Rocha
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
