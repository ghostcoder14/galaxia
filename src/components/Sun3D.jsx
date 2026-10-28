import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

function Sun() {
  const sunRef = useRef();

  useFrame(() => {
    sunRef.current.rotation.y += 0.001; 
  });

  return (
    <mesh ref={sunRef}>
      {/* Sun Sphere */}
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={new THREE.TextureLoader().load('/textures/sun.jpg')}
        emissiveMap={new THREE.TextureLoader().load('/textures/sun.jpg')}
        emissive={new THREE.Color(0xffaa00)}
        emissiveIntensity={1.5}
      />

      {/* Corona Glow */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color={0xffaa00}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
}

export default function Sun3D() {
  return (
    <Canvas camera={{ position: [5, 2, 5] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Sun />
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} />
      <OrbitControls autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
}
