"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

function ResponsiveCameraController() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    if (aspect < 0.8) {
      // Mobile Portrait: step camera back and increase FOV so house isn't cut off
      camera.position.set(0, 2.2, 11);
      (camera as THREE.PerspectiveCamera).fov = 52;
    } else if (aspect < 1.2) {
      // Mobile Landscape / Tablet
      camera.position.set(0, 2.1, 9.5);
      (camera as THREE.PerspectiveCamera).fov = 48;
    } else {
      // Desktop
      camera.position.set(0, 2, 8);
      (camera as THREE.PerspectiveCamera).fov = 45;
    }
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera]);

  return null;
}

function ArchitecturalModel({ isLowPerf }: { isLowPerf: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/villa.glb");
  const { size } = useThree();
  const lastTimeRef = useRef(0);

  const aspect = size.width / size.height;
  const modelScale = aspect < 0.8 ? 1.5 : aspect < 1.2 ? 2.0 : 2.5;
  const posY = aspect < 0.8 ? -0.4 : -1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (time - lastTimeRef.current < 0.032) return;
    lastTimeRef.current = time;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.06;
      if (!isLowPerf) {
        groupRef.current.position.y = posY + Math.sin(time * 0.3) * (aspect < 0.8 ? 0.06 : 0.12);
      }
    }
  });

  return (
    <Float speed={isLowPerf ? 0 : 1.0} rotationIntensity={0.1} floatIntensity={isLowPerf ? 0 : 0.2}>
      <group ref={groupRef} scale={modelScale} position={[0, posY, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#FFF5D0" />
      <directionalLight position={[5, 8, 5]} intensity={1.4} color="#FFEAA7" />
      <directionalLight position={[-5, -2, -5]} intensity={0.5} color="#D4AF37" />
      <fog attach="fog" args={["#06080E", 10, 25]} />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border border-[var(--gold-imperial)] rounded-full animate-spin border-t-transparent shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
        <span className="text-[10px] tracking-[0.25em] uppercase font-cinzel font-semibold text-[var(--gold-imperial)]">
          Summoning 3D Palace
        </span>
      </div>
    </div>
  );
}

export default function ThreeArchitecturalFragment() {
  const [dpr, setDpr] = useState(1);
  const [isLowPerf, setIsLowPerf] = useState(false);

  return (
    <div className="w-full h-full">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 45 }}
          dpr={dpr}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            precision: "mediump",
          }}
          style={{ background: "transparent" }}
        >
          <ResponsiveCameraController />
          <PerformanceMonitor
            onIncline={() => setDpr(1)}
            onDecline={() => {
              setDpr(0.75);
              setIsLowPerf(true);
            }}
          />
          <SceneLighting />
          <ArchitecturalModel isLowPerf={isLowPerf} />
        </Canvas>
      </Suspense>
    </div>
  );
}

// Preload GLB asset
useGLTF.preload("/villa.glb");