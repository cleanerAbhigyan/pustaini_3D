import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:4173";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const result = {
  browser: browser.version(),
  conditions:
    "Headless Chromium, Linux; software WebGL; no CPU/network throttling; fresh contexts; localhost production preview",
  checks: [],
  profiles: [],
};
async function check(name, callback) {
  await callback();
  result.checks.push(name);
  console.log(`PASS ${name}`);
}
async function scrollChapter(page, id, progress = 0) {
  await page.evaluate(
    ({ id, progress }) => {
      const el = document.getElementById(id);
      window.scrollTo(
        0,
        el.offsetTop + progress * (el.offsetHeight - innerHeight),
      );
    },
    { id, progress },
  );
  await page.waitForTimeout(120);
}
async function overflow(page) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
}
async function sceneData(page) {
  return page.locator("canvas").evaluate((el) => ({ ...el.dataset }));
}
try {
  for (const profile of [
    {
      name: "desktop",
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    },
    {
      name: "mobile-emulated",
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    },
  ]) {
    const context = await browser.newContext(profile);
    const page = await context.newPage();
    const errors = [];
    const warnings = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
      if (msg.type() === "warning") warnings.push(msg.text());
    });
    const requests = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") requests.push(request.url());
    });
    await page.goto(`${base}/?diagnostics=1`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await check(`${profile.name}: initial HTML and deferred 3D`, async () => {
      const html = await (await context.request.get(base)).text();
      assert.ok(html.includes("initial-opening"));
      assert.ok(!requests.some((url) => url.includes("RunwayScene")));
      await overflow(page);
    });
    await page.screenshot({ path: `artifacts/${profile.name}-opening.png` });
    await check(`${profile.name}: keyboard skip link`, async () => {
      await page.keyboard.press("Tab");
      await page
        .getByRole("link", { name: "Skip to collection" })
        .evaluate((el) => {
          if (el !== document.activeElement)
            throw Error("skip link not focused");
        });
      await page.keyboard.press("Enter");
      await page.waitForTimeout(120);
      assert.equal(await page.evaluate(() => location.hash), "#collection");
      await overflow(page);
    });
    await scrollChapter(page, "opening");
    await check(
      `${profile.name}: both blinks forward and reverse; idle release; no pointer interception`,
      async () => {
        for (const id of ["house-film", "runway"]) {
          const center = await page
            .locator(`#${id}`)
            .evaluate((el) => el.offsetTop - innerHeight * 0.5);
          for (const direction of [1, -1]) {
            await page.evaluate(
              (y) => scrollTo(0, y),
              center - direction * 180,
            );
            await page.waitForTimeout(60);
            const closed = await page.evaluate(async (y) => {
              scrollTo(0, y);
              await new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
              );
              return Number(
                document
                  .getElementById("chapter-blink")
                  .style.getPropertyValue("--blink"),
              );
            }, center);
            assert.ok(
              closed > 0.95,
              `${id}, direction ${direction}: ${closed}`,
            );
            assert.equal(
              await page
                .locator("#chapter-blink")
                .evaluate((el) => getComputedStyle(el).pointerEvents),
              "none",
            );
            await page.waitForTimeout(250);
            assert.equal(
              await page
                .locator("#chapter-blink")
                .evaluate((el) => Number(el.style.getPropertyValue("--blink"))),
              0,
            );
          }
        }
      },
    );
    await scrollChapter(page, "runway", 0);
    await page.waitForFunction(
      () => document.querySelector("canvas")?.dataset.pose,
    );
    await check(
      `${profile.name}: fixed camera; approach; slight turn; final hold; reverse`,
      async () => {
        const start = await sceneData(page);
        await scrollChapter(page, "runway", 0.5);
        const middle = await sceneData(page);
        await scrollChapter(page, "runway", 0.9);
        const end = await sceneData(page);
        assert.ok(JSON.parse(start.pose).z < JSON.parse(middle.pose).z);
        assert.ok(JSON.parse(middle.pose).z < JSON.parse(end.pose).z);
        assert.ok(JSON.parse(end.pose).turn < -0.25);
        assert.equal(start.camera, end.camera);
        assert.ok(Number(end.dpr) <= 1.5);
        await page.screenshot({
          path: `artifacts/${profile.name}-runway-final.png`,
        });
        await page.waitForTimeout(250);
        const idle = await sceneData(page);
        await page.waitForTimeout(400);
        assert.equal((await sceneData(page)).frames, idle.frames);
        await scrollChapter(page, "runway", 0.98);
        assert.equal((await sceneData(page)).pose, end.pose);
        await scrollChapter(page, "runway", 0.5);
        assert.equal((await sceneData(page)).pose, middle.pose);
        result.profiles.push({ ...profile, finalScene: end, warnings });
      },
    );
    if (profile.hasTouch) {
      await check("mobile-emulated: touch scroll", async () => {
        const session = await context.newCDPSession(page);
        const y = await page.evaluate(() => scrollY);
        await session.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: 180, y: 500 }],
        });
        for (let y = 480; y >= 200; y -= 20) {
          await session.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x: 180, y }],
          });
          await page.waitForTimeout(20);
        }
        await session.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await page.waitForTimeout(200);
        assert.ok((await page.evaluate(() => scrollY)) > y);
      });
    } else {
      await check("desktop: keyboard PageDown and PageUp", async () => {
        await page.locator("#runway").focus();
        const y = await page.evaluate(() => scrollY);
        await page.keyboard.press("PageDown");
        await page.waitForTimeout(350);
        assert.ok((await page.evaluate(() => scrollY)) > y);
        await page.keyboard.press("PageUp");
        await page.waitForTimeout(350);
        assert.ok((await page.evaluate(() => scrollY)) < y + 300);
      });
    }
    await check(
      `${profile.name}: catalogue link, footer links and replay`,
      async () => {
        await page.goto(`${base}/?diagnostics=1#collection`);
        await page
          .getByRole("link", { name: "View The Sovereign in the catalogue" })
          .click();
        assert.equal(
          await page.evaluate(() => location.hash),
          "#sovereign-details",
        );
        assert.equal(
          await page
            .locator("#sovereign-details")
            .evaluate((el) => document.activeElement === el),
          true,
        );
        await page
          .getByRole("link", { name: "Revisit the collection" })
          .click();
        assert.equal(await page.evaluate(() => location.hash), "#collection");
        await page.screenshot({
          path: `artifacts/${profile.name}-collection.png`,
        });
        await page.getByRole("link", { name: "Replay the experience" }).click();
        assert.equal(await page.evaluate(() => location.hash), "#opening");
        assert.ok((await page.evaluate(() => scrollY)) < 10);
      },
    );
    await check(
      `${profile.name}: all chapters without horizontal overflow`,
      async () => {
        for (const id of ["opening", "house-film", "runway", "collection"]) {
          await scrollChapter(page, id);
          await overflow(page);
        }
      },
    );
    await check(`${profile.name}: axe WCAG 2 A/AA and 2.1 AA`, async () => {
      const scan = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      await writeFile(
        `artifacts/${profile.name}-axe.json`,
        JSON.stringify(scan, null, 2),
      );
      assert.deepEqual(
        scan.violations.map(({ id, nodes }) => ({ id, count: nodes.length })),
        [],
      );
    });
    if (!profile.hasTouch) {
      await check(
        "desktop: resize to 320px and 200% equivalent layout",
        async () => {
          for (const viewport of [
            { width: 320, height: 740 },
            { width: 720, height: 500 },
          ]) {
            await page.setViewportSize(viewport);
            for (const id of [
              "opening",
              "house-film",
              "runway",
              "collection",
            ]) {
              await scrollChapter(page, id, 0.5);
              await overflow(page);
            }
          }
          await page.setViewportSize(profile.viewport);
        },
      );
      await check(
        "desktop: repeatable Chromium runway performance trace",
        async () => {
          await scrollChapter(page, "runway", 0);
          const session = await context.newCDPSession(page);
          await session.send("Tracing.start", {
            categories: "toplevel,devtools.timeline,v8,blink.user_timing",
            transferMode: "ReturnAsStream",
          });
          const done = new Promise((resolve) =>
            session.once("Tracing.tracingComplete", resolve),
          );
          for (let i = 0; i <= 40; i++)
            await scrollChapter(page, "runway", i / 40);
          for (let i = 40; i >= 0; i--)
            await scrollChapter(page, "runway", i / 40);
          await session.send("Tracing.end");
          const { stream } = await done;
          let content = "";
          while (true) {
            const chunk = await session.send("IO.read", { handle: stream });
            content += chunk.data;
            if (chunk.eof) break;
          }
          await session.send("IO.close", { handle: stream });
          await writeFile("artifacts/runway-trace.json", content);
          const trace = JSON.parse(content);
          const mainThread = trace.traceEvents.find(
            (e) =>
              e.name === "thread_name" && e.args?.name === "CrRendererMain",
          );
          const tasks = trace.traceEvents.filter(
            (e) =>
              (e.name === "RunTask" ||
                e.name === "ThreadControllerImpl::RunTask") &&
              e.ph === "X" &&
              e.tid === mainThread?.tid &&
              e.pid === mainThread?.pid,
          );
          result.trace = {
            steps: 82,
            msBetweenSteps: 120,
            tasks: tasks.length,
            longTasks: tasks.length
              ? tasks.filter((e) => e.dur > 50000).length
              : null,
            maxTaskMs: tasks.length
              ? Math.max(...tasks.map((e) => e.dur / 1000))
              : null,
          };
        },
      );
    }
    await check(
      `${profile.name}: no scene rendering offscreen and no browser errors`,
      async () => {
        await scrollChapter(page, "opening");
        await page.waitForTimeout(300);
        const before = await sceneData(page);
        await page.waitForTimeout(400);
        assert.equal((await sceneData(page)).frames, before.frames);
        assert.deepEqual(errors, []);
      },
    );
    await check(
      `${profile.name}: direct anchor on a fresh document`,
      async () => {
        await page.goto(`${base}/#runway`);
        await page.waitForFunction(
          () =>
            Math.abs(
              document.getElementById("runway")?.getBoundingClientRect().top -
                110,
            ) < 2,
        );
        assert.equal(
          await page
            .locator("#runway")
            .evaluate((el) => el === document.activeElement),
          true,
        );
      },
    );
    await context.close();
  }
  for (const mode of ["reduced-motion", "no-webgl"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    const scripts = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(request.url());
    });
    if (mode === "no-webgl")
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
          return kind.startsWith("webgl") || kind === "experimental-webgl"
            ? null
            : original.call(this, kind, ...args);
        };
      });
    await page.goto(`${base}/#runway`);
    await check(
      `${mode}: readable fallback, no 3D bundle; catalogue and replay usable`,
      async () => {
        await page
          .getByText(
            mode === "reduced-motion"
              ? "The static runway · Reduced motion"
              : "The static runway · 3D is unavailable",
            { exact: true },
          )
          .waitFor();
        await page.waitForFunction(
          () =>
            Math.abs(
              document.getElementById("runway")?.getBoundingClientRect().top -
                110,
            ) < 2,
        );
        assert.equal(await page.locator("canvas").count(), 0);
        assert.ok(!scripts.some((url) => url.includes("RunwayScene")));
        await overflow(page);
        await page.screenshot({ path: `artifacts/${mode}.png` });
        if (mode === "reduced-motion")
          assert.equal(
            await page
              .locator("#chapter-blink")
              .evaluate((el) => getComputedStyle(el).display),
            "none",
          );
        await page
          .getByRole("link", { name: "Discover the collection" })
          .click();
        assert.equal(await page.evaluate(() => location.hash), "#collection");
        await page.getByRole("link", { name: "Replay the experience" }).click();
        assert.ok((await page.evaluate(() => scrollY)) < 10);
      },
    );
    await context.close();
  }
} finally {
  await writeFile(
    "artifacts/browser-results.json",
    JSON.stringify(result, null, 2),
  );
  await browser.close();
}
