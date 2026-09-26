"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Cylinder, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function MicVisual() {
  const group = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (group.current) {
      // Gentle floating animation
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      group.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) * 0.1;
    }
    if (ringRef.current) {
      // Pulse animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={group}>
      {/* Mic Top (Sphere) */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#B5B9F0" metalness={0.5} roughness={0.2} />
      </Sphere>
      {/* Mic Body (Cylinder) */}
      <Cylinder args={[0.2, 0.2, 1, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2E4540" />
      </Cylinder>
      {/* Pulse Ring */}
      <mesh ref={ringRef} position={[0, 0.8, 0]}>
        <ringGeometry args={[0.6, 0.7, 32]} />
        <meshBasicMaterial color="#B5B9F0" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function HeroMicVisual() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <MicVisual />
        </Float>
      </Canvas>
    </div>
  );
}
