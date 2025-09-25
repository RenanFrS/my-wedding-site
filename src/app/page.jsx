"use client";
import React from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Timeline from "../components/Timeline";
import FlowerDividerMain from "../components/dividers/FlowerDividerMain";
import Story from "../components/Story";
import GalleryMasonry from "../components/Masonry";
import Quote from "../components/Quote";
import Hands from "../components/Hands";
import Stay from "../components/Stay";
import Confirmacao from "../components/Confirmacao";
import MensagemNoivos from "../components/MensagemNoivos";
import Registry from "../components/Registry";
import PartingMessage from "../components/PartingMessage";
import Footer from "../components/Footer";
import { useRevealOnScroll } from "../components/hooks/useRevealOnScroll";

export default function Page() {
  useRevealOnScroll();
  return (
    <div className="text-[#6d4635] font-serif overflow-x-hidden">
      <Navbar />
      {/* Início */}
      <section id="inicio">
        <Hero />
      </section>
      <Timeline />
      <div className="mt-2 mb-10">
        <FlowerDividerMain />
      </div>
      <div className="v-reposition-container absolute left-0 right-0 w-screen">
        <div className="h-reposition-container w-screen relative top-[100vh] md:static md:top-0">
          <section id="o-casal">
            <Story />
          </section>
          <GalleryMasonry />
          <Quote />
          <Hands />
          <section id="cerimonia">
            <Stay />
          </section>
          <Confirmacao />
          <MensagemNoivos />
          <section id="presentes">
            <Registry />
          </section>
          <PartingMessage />
          <Footer />
        </div>
      </div>
    </div>
  );
}
