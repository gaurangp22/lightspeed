"use client";
import React from "react";
import { BackgroundBeams } from "./components/ui/background-beams";
import PfpGenerator from "./PfpGenerator";

export function BackgroundBeamsDemo() {
    return (
        <div className="min-h-screen w-full bg-[#111111] relative flex items-center justify-center antialiased p-8">
            <BackgroundBeams className="opacity-20" />
            <div className="relative z-10">
                <PfpGenerator />
            </div>
        </div>
    );
}
