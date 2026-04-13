"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function PartingMessage(): React.JSX.Element {
  return (
    <div className="parting-message reveal text-center">
      {/* <h1 className="mt-[10vh] text-[7rem] leading-[7rem] font-medium">
        Esperamos você
      </h1> */}
      <Button asChild className="mx-auto w-[325px]">
        <a href="http://instagra.com/renanrocha.01/">Confirme Presença</a>
      </Button>
    </div>
  );
}
