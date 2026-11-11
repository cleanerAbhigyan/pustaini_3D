import { useEffect } from "react";
import { chapters } from "../content/chapters";

export const clamp = (n: number) => Math.min(1, Math.max(0, n));
export type ScrollSample = { progress: number; visible: boolean };
const listeners = new Set<() => void>();
export const runwayProgress: ScrollSample = { progress: 0, visible: false };
export function subscribeRunway(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// One scheduled read/write pass per scroll event; no per-frame React updates.
export function useChapterScroll() {
  useEffect(() => {
    const sections = chapters.map(({ id }) => document.getElementById(id)!);
    const blink = document.getElementById("chapter-blink")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let release = 0;
    function update() {
      frame = 0;
      const height = window.innerHeight;
      const bounds = sections.map((section) => section.getBoundingClientRect());
      let active = 0;
      bounds.forEach((bound, index) => {
        if (bound.top <= height * 0.45) active = index;
      });
      document
        .querySelectorAll<HTMLAnchorElement>("[data-chapter-link]")
        .forEach((link) => {
          if (link.hash === `#${chapters[active].id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      const runway = bounds[2];
      runwayProgress.progress = clamp(
        -runway.top / Math.max(1, runway.height - height),
      );
      runwayProgress.visible =
        runway.bottom > 0 && runway.top < height && !document.hidden;
      sections[2].dataset.progress = runwayProgress.progress.toFixed(3);
      listeners.forEach((listener) => listener());
      const catalogue = bounds[3];
      sections[3].style.setProperty(
        "--unfold",
        String(clamp((height - catalogue.top) / height)),
      );
      // A narrow scroll-space eyelid closes/reopens equally in both directions.
      const proximity = Math.min(
        ...[bounds[1], bounds[2]].map((b) => Math.abs(b.top - height * 0.5)),
      );
      const closed = reduced.matches
        ? 0
        : clamp(1 - proximity / (height * 0.14));
      blink.style.setProperty("--blink", String(closed));
      clearTimeout(release);
      if (closed > 0)
        release = window.setTimeout(
          () => blink.style.setProperty("--blink", "0"),
          180,
        );
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const resize = new ResizeObserver(schedule);
    sections.forEach((section) => resize.observe(section));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    // React inserts sections after the browser's initial fragment lookup.
    // Restore that first native anchor once the complete document is mounted.
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    }
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(release);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);
}
