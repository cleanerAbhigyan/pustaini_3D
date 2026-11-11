import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { clamp, runwayProgress, subscribeRunway } from "./scroll";

const diagnostics = new URLSearchParams(location.search).has("diagnostics");
const smooth = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};

// Replacement seam: retain this root's transform; replace its contents with an
// approved GLB. Scrub its mixer with progress, rather than elapsed wall time.
function RunwayFigure() {
  const root = useRef<Group>(null);
  const leftLeg = useRef<Mesh>(null);
  const rightLeg = useRef<Mesh>(null);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    let last = -1;
    const update = () => {
      if (runwayProgress.visible && last !== runwayProgress.progress) {
        last = runwayProgress.progress;
        invalidate();
      }
    };
    update();
    return subscribeRunway(update);
  }, [invalidate]);
  useFrame(({ gl, camera }) => {
    if (!root.current) return;
    const p = runwayProgress.progress;
    const walk = Math.min(p / 0.76, 1);
    const settle = smooth((p - 0.7) / 0.16);
    const stride = Math.sin(walk * Math.PI * 14) * 0.23 * (1 - settle);
    root.current.position.set(0, Math.abs(stride) * 0.06, -15 + walk * 15);
    root.current.rotation.y = -0.28 * smooth((p - 0.76) / 0.12);
    if (leftLeg.current) leftLeg.current.rotation.x = stride;
    if (rightLeg.current) rightLeg.current.rotation.x = -stride;
    // Opt-in browser QA instrumentation, with no React state or runtime UI.
    if (diagnostics) {
      const data = gl.domElement.dataset;
      data.frames = String(Number(data.frames ?? 0) + 1);
      data.pose = JSON.stringify({
        z: root.current.position.z,
        turn: root.current.rotation.y,
        stride,
      });
      data.camera = JSON.stringify({
        position: camera.position.toArray(),
        rotation: camera.rotation.toArray(),
      });
      data.calls = String(gl.info.render.calls);
      data.triangles = String(gl.info.render.triangles);
      data.dpr = String(gl.getPixelRatio());
    }
  });
  return (
    <group ref={root} name="RunwayFigure">
      <mesh position={[0, 2.94, 0]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color="#d4b79b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.66, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.2, 12]} />
        <meshStandardMaterial color="#d4b79b" />
      </mesh>
      <mesh position={[0, 2.26, 0]}>
        <cylinderGeometry args={[0.3, 0.23, 0.65, 16]} />
        <meshStandardMaterial color="#5d1930" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.47, 0]}>
        <cylinderGeometry args={[0.23, 0.56, 1.04, 20]} />
        <meshStandardMaterial color="#4b1325" roughness={0.6} />
      </mesh>
      <mesh ref={leftLeg} position={[-0.18, 0.53, 0]}>
        <capsuleGeometry args={[0.09, 0.77, 4, 8]} />
        <meshStandardMaterial color="#b6957b" />
      </mesh>
      <mesh ref={rightLeg} position={[0.18, 0.53, 0]}>
        <capsuleGeometry args={[0.09, 0.77, 4, 8]} />
        <meshStandardMaterial color="#b6957b" />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.18, 0.085, 0.08]}>
            <boxGeometry args={[0.18, 0.14, 0.35]} />
            <meshStandardMaterial color="#191115" />
          </mesh>
          <mesh position={[side * 0.39, 2.15, 0]} rotation-z={side * 0.12}>
            <capsuleGeometry args={[0.085, 0.67, 4, 8]} />
            <meshStandardMaterial color="#d4b79b" />
          </mesh>
        </group>
      ))}
      <group name="SovereignStandIn" position={[0.67, 1.41, 0.15]}>
        <mesh>
          <boxGeometry args={[0.65, 0.48, 0.23]} />
          <meshStandardMaterial color="#101013" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.18, 0.022, 6, 24, Math.PI]} />
          <meshStandardMaterial
            color="#c4a365"
            metalness={0.7}
            roughness={0.32}
          />
        </mesh>
        <mesh position={[0, 0.05, 0.125]}>
          <sphereGeometry args={[0.038, 10, 8]} />
          <meshStandardMaterial
            color="#ddbd78"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        {[-2, -1, 0, 1, 2].map((feather) => (
          <mesh
            key={feather}
            position={[feather * 0.056, -0.035, 0.125]}
            rotation-z={-feather * 0.3}
            scale={[0.028, 0.12, 0.012]}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color="#d6b76e"
              metalness={0.6}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function RunwayScene() {
  return (
    <div
      className="scene"
      role="img"
      aria-label="Fixed front-row runway view. A stylized figure approaches, turns slightly and holds The Sovereign black handbag with a gold peacock motif. Illustrative stand-ins."
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.9, 7], fov: 44, near: 0.1, far: 55 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 1.55, -4);
          gl.domElement.addEventListener("webglcontextlost", () => {
            // Escalate lost contexts to the same readable error-boundary fallback.
            if (gl.domElement.isConnected) {
              gl.domElement.dispatchEvent(
                new CustomEvent("runway-context-lost", { bubbles: true }),
              );
            }
          });
        }}
      >
        <color attach="background" args={["#160d12"]} />
        <fog attach="fog" args={["#160d12", 13, 32]} />
        <hemisphereLight args={["#f6e5ce", "#39202b", 2.2]} />
        <directionalLight position={[2, 6, 5]} color="#fff0d4" intensity={3} />
        <directionalLight
          position={[-4, 3, -4]}
          color="#b98869"
          intensity={2}
        />
        <mesh position={[0, -0.13, -10]}>
          <boxGeometry args={[3.1, 0.22, 27]} />
          <meshStandardMaterial color="#bcaa8f" roughness={0.65} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 1.57, -0.006, -10]}>
              <boxGeometry args={[0.025, 0.025, 27]} />
              <meshBasicMaterial color="#c5a363" />
            </mesh>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <mesh key={i} position={[side * 2.3, 0.23, 1 - i * 2.8]}>
                <boxGeometry args={[0.5, 0.55, 0.65]} />
                <meshStandardMaterial color="#3b202c" />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[0, 2.3, -23]}>
          <planeGeometry args={[8, 5]} />
          <meshStandardMaterial color="#481426" />
        </mesh>
        <RunwayFigure />
      </Canvas>
    </div>
  );
}
