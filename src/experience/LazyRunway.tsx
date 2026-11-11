import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const Scene = lazy(() => import("./RunwayScene"));

function StaticRunway({ reason }: { reason: string }) {
  return (
    <div className="static-runway">
      <img
        src="/assets/sovereign-study.svg"
        width="600"
        height="500"
        alt="The Sovereign illustrative stand-in: black bag with a gold peacock motif."
      />
      <p>{reason}</p>
      <a href="#collection" className="text-link">
        Explore The Sovereign ↓
      </a>
    </div>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <StaticRunway reason="The static runway · 3D is unavailable" />
    ) : (
      this.props.children
    );
  }
}

export default function LazyRunway() {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [mode, setMode] = useState<
    "pending" | "motion" | "reduced" | "unavailable"
  >("pending");
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => {
      if (media.matches) {
        setMode("reduced");
        return;
      }
      const canvas = document.createElement("canvas");
      try {
        const context = canvas.getContext("webgl2");
        setMode(context ? "motion" : "unavailable");
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        setMode("unavailable");
      }
    };
    check();
    const element = host.current;
    const lost = () => setMode("unavailable");
    element?.addEventListener("runway-context-lost", lost);
    media.addEventListener("change", check);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "75% 0px" },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      media.removeEventListener("change", check);
      observer.disconnect();
      element?.removeEventListener("runway-context-lost", lost);
    };
  }, []);
  return (
    <div className="runway-visual" ref={host}>
      {mode === "reduced" ? (
        <StaticRunway reason="The static runway · Reduced motion" />
      ) : mode === "unavailable" ? (
        <StaticRunway reason="The static runway · 3D is unavailable" />
      ) : near && mode === "motion" ? (
        <SceneBoundary>
          <Suspense fallback={<StaticRunway reason="Preparing the runway…" />}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      ) : (
        <StaticRunway reason="The Sovereign · Runway study" />
      )}
    </div>
  );
}
