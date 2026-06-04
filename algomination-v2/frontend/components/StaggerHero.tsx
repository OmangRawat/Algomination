"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

/**
 * Faithful port of the original Algomination home-page hero (custom.js):
 * a grid of dots with a cursor that hops to a random cell and ripples a
 * stagger wave outward, looping forever. Rebuilt as a self-contained React
 * client component (themed to the v2 dark palette) with proper cleanup.
 */
const GRID: [number, number] = [20, 12]; // columns, rows
const CELL = 55; // px — 20 * 55 ≈ the 1100px design width
const COUNT = GRID[0] * GRID[1];

export function StaggerHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const dotsWrapperRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visualizer = visualizerRef.current;
    const dotsWrapper = dotsWrapperRef.current;
    const cursor = cursorRef.current;
    if (!visualizer || !dotsWrapper || !cursor) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Scale the fixed 1100px-wide grid down to fit its parent.
    function fit() {
      if (!visualizer) return;
      anime.set(visualizer, { scale: 1 });
      const parent = visualizer.parentElement;
      if (!parent) return;
      const ratio = parent.offsetWidth / visualizer.offsetWidth;
      anime.set(visualizer, { scale: Math.min(ratio, 1) });
    }

    // Build the dot grid imperatively (kept outside React's render tree).
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      fragment.appendChild(dot);
    }
    dotsWrapper.appendChild(fragment);

    fit();
    window.addEventListener("resize", fit);

    let index = anime.random(0, COUNT - 1);
    let nextIndex = 0;
    let animation: anime.AnimeTimelineInstance | undefined;
    let stopped = false;

    anime.set(".stagger-visualizer .cursor", {
      translateX: anime.stagger(-CELL, { grid: GRID, from: index, axis: "x" }),
      translateY: anime.stagger(-CELL, { grid: GRID, from: index, axis: "y" }),
      translateZ: 0,
      scale: 1.5,
    });

    function play() {
      if (stopped) return;
      if (animation) animation.pause();

      nextIndex = anime.random(0, COUNT - 1);

      animation = anime
        .timeline({ easing: "easeInOutQuad", complete: play })
        .add({
          targets: ".stagger-visualizer .cursor",
          keyframes: [
            { scale: 0.75, duration: 120 },
            { scale: 2.5, duration: 220 },
            { scale: 1.5, duration: 450 },
          ],
          duration: 300,
        })
        .add(
          {
            targets: ".stagger-visualizer .dot",
            keyframes: [
              {
                translateX: anime.stagger("-2px", {
                  grid: GRID,
                  from: index,
                  axis: "x",
                }),
                translateY: anime.stagger("-2px", {
                  grid: GRID,
                  from: index,
                  axis: "y",
                }),
                duration: 100,
              },
              {
                translateX: anime.stagger("4px", {
                  grid: GRID,
                  from: index,
                  axis: "x",
                }),
                translateY: anime.stagger("4px", {
                  grid: GRID,
                  from: index,
                  axis: "y",
                }),
                scale: anime.stagger([2.6, 1], { grid: GRID, from: index }),
                duration: 225,
              },
              { translateX: 0, translateY: 0, scale: 1, duration: 1200 },
            ],
            delay: anime.stagger(80, { grid: GRID, from: index }),
          },
          30,
        )
        .add(
          {
            targets: ".stagger-visualizer .cursor",
            translateX: {
              value: anime.stagger(-CELL, {
                grid: GRID,
                from: nextIndex,
                axis: "x",
              }),
            },
            translateY: {
              value: anime.stagger(-CELL, {
                grid: GRID,
                from: nextIndex,
                axis: "y",
              }),
            },
            scale: 1.5,
            easing: "cubicBezier(.075, .2, .165, 1)",
          },
          "-=800",
        );

      index = nextIndex;
    }

    if (!reduceMotion) play();

    return () => {
      stopped = true;
      if (animation) animation.pause();
      window.removeEventListener("resize", fit);
      anime.remove(".stagger-visualizer .dot");
      anime.remove(".stagger-visualizer .cursor");
      dotsWrapper.replaceChildren();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full overflow-hidden">
      {/* Animated dot grid */}
      <div className="animation-wrapper" aria-hidden>
        <div ref={visualizerRef} className="stagger-visualizer">
          <div ref={cursorRef} className="cursor" />
          <div ref={dotsWrapperRef} className="dots-wrapper" />
        </div>
      </div>

      {/* Overlaid title */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <h1 className="font-[family-name:var(--font-display)] text-6xl text-foreground drop-shadow-[0_2px_24px_rgba(99,102,241,0.45)] sm:text-8xl">
          Algomination
        </h1>
        <p className="font-[family-name:var(--font-script)] text-4xl text-accent sm:text-6xl">
          ~ Algorithms with Animation
        </p>
      </div>
    </div>
  );
}
