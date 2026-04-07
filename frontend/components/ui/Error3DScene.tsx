"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Esferas orbitando ao redor
function OrbitingObjects() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const objects = [
    { angle: 0, radius: 2.5, color: "#58a6ff", size: 0.15, y: 0.3 },
    { angle: Math.PI / 3, radius: 3, color: "#3fb950", size: 0.12, y: -0.2 },
    { angle: (2 * Math.PI) / 3, radius: 2.8, color: "#a371f7", size: 0.14, y: 0.5 },
    { angle: Math.PI, radius: 3.2, color: "#f85149", size: 0.1, y: -0.4 },
    { angle: (4 * Math.PI) / 3, radius: 2.6, color: "#d29922", size: 0.11, y: 0.1 },
    { angle: (5 * Math.PI) / 3, radius: 3.4, color: "#58a6ff", size: 0.09, y: -0.3 },
  ];

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(obj.angle) * obj.radius,
            obj.y,
            Math.sin(obj.angle) * obj.radius,
          ]}
        >
          <sphereGeometry args={[obj.size, 32, 32]} />
          <meshStandardMaterial
            color={obj.color}
            emissive={obj.color}
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

// Anéis sutis ao redor do centro
function Rings() {
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  const ref3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref1.current) ref1.current.rotation.z = state.clock.elapsedTime * 0.05;
    if (ref2.current) ref2.current.rotation.z = -state.clock.elapsedTime * 0.08;
    if (ref3.current) ref3.current.rotation.x = state.clock.elapsedTime * 0.03;
  });

  return (
    <>
      <mesh ref={ref1} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#58a6ff" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ref2} rotation={[-0.2, 0, 0]}>
        <torusGeometry args={[3.3, 0.01, 16, 100]} />
        <meshBasicMaterial color="#3fb950" transparent opacity={0.15} />
      </mesh>
      <mesh ref={ref3} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[3.8, 0.008, 16, 100]} />
        <meshBasicMaterial color="#a371f7" transparent opacity={0.1} />
      </mesh>
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 10]} intensity={1} />
      <pointLight position={[-5, -5, 5]} color="#58a6ff" intensity={0.5} />
      
      <Stars radius={100} depth={50} count={600} factor={4} saturation={0} fade speed={0.2} />
      <OrbitingObjects />
      <Rings />
    </>
  );
}

export default function Error3DScene() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
