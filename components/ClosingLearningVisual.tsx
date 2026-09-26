"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Box } from "@react-three/drei";
import * as THREE from "three";

function LearningBlocks() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime / 4) * 0.5;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Box args={[0.8, 0.8, 0.8]} position={[-1.2, 0, 0]}>
          <meshStandardMaterial color="#B5B9F0" />
        </Box>
      </Float>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
        <Box args={[0.8, 0.8, 0.8]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#2E4540" />
        </Box>
      </Float>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
        <Box args={[0.8, 0.8, 0.8]} position={[1.2, -0.3, 0]}>
          <meshStandardMaterial color="#B5B9F0" />
        </Box>
      </Float>
    </group>
  );
}

export default function ClosingLearningVisual() {
  return (
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <LearningBlocks />
      </Canvas>
    </div>
  );
}
