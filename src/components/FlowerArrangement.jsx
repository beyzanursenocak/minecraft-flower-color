import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CUSTOM_COLORS = [
  '#FF0000', // Kırmızı
  '#FF69B4', // Pembe
  '#FF1493', // Koyu Pembe
  '#FFB6C1', // Açık Pembe
  '#FFC0CB', // Pembe
  '#FF69B4'  // Hot Pink
]

const Block = ({ position, size = [1, 1, 1], color = '#ffffff', rotation = [0, 0, 0] }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={new THREE.Color(color)}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

function Flower({ position, type = 'rose', color = '#ff0000', baseRotationY = 0, tiltAngleX = 0 }) {
  const groupRef = useRef()
  const blockSize = 0.2
  
  useFrame((state) => {
    if (groupRef.current) {
      // Inward/opposite tilt (around X) + slight sway
      groupRef.current.rotation.x = -tiltAngleX + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      // Base Y rotation (around vase) + sway
      groupRef.current.rotation.y = baseRotationY + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      // Vertical swaying
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const blocks = []

  // Farklı çiçek türleri
  if (type === 'rose') {
    // Gül yapısı
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const radius = 0.4
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      blocks.push(
        <Block
          key={`petal-${i}`}
          position={[x, 0.2, z]}
          size={[blockSize, blockSize, blockSize]}
          color={color}
          rotation={[0, angle, 0]}
        />
      )
    }
  } else if (type === 'daisy') {
    // Papatya yapısı
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const radius = 0.5
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      blocks.push(
        <Block 
          key={`petal-${i}`}
          position={[x, 0, z]}
          size={[blockSize * 1.5, blockSize * 0.5, blockSize]}
          color="#ffffff"
          rotation={[0, angle, 0]}
        />
      )
    }
  } else if (type === 'tulip') {
    // Lale yapısı
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const radius = 0.3
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      blocks.push(
        <Block 
          key={`petal-${i}`}
          position={[x, 0.3, z]}
          size={[blockSize, blockSize * 2, blockSize]}
          color={color}
          rotation={[Math.PI / 4, angle, 0]}
        />
      )
    }
  }
  
  // Çiçek merkezi
  blocks.push(
    <Block
      key="center"
      position={[0, 0.2, 0]}
      size={[blockSize * 1.5, blockSize * 1.5, blockSize * 1.5]}
      color={type === 'daisy' ? "#ffff00" : "#ffff00"}
    />
  )

  // Gövde - Kaldırıldı
  /*
  for (let i = 0; i < 10; i++) { 
    blocks.push(
      <Block
        key={`stem-${i}`}
        position={[0, -0.2 - (i * blockSize), 0]}
        size={[blockSize * 0.5, blockSize, blockSize * 0.5]}
        color="#228B22"
      />
    )
  }
  */

  // Yapraklar
  blocks.push(
    <Block
      key="leaf1"
      position={[0.3, -0.4, 0]}
      size={[blockSize * 2, blockSize * 0.5, blockSize]}
      color="#228B22"
      rotation={[0, Math.PI / 4, 0]}
    />
  )
  blocks.push(
    <Block
      key="leaf2"
      position={[-0.3, -0.6, 0]}
      size={[blockSize * 2, blockSize * 0.5, blockSize]}
      color="#228B22"
      rotation={[0, -Math.PI / 4, 0]}
    />
  )

  return (
    <group ref={groupRef} position={position}>
      {blocks}
    </group>
  )
}

function Heart({ position, scale = 1, color = '#ff0000' }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const heartShape = [
    // Top left lobe
    { pos: [-0.5, 0.5, 0], size: [1, 1, 1] },
    { pos: [-1, 0, 0], size: [1, 1, 1] },
    { pos: [-0.5, -0.5, 0], size: [1, 1, 1] },
    // Top right lobe
    { pos: [0.5, 0.5, 0], size: [1, 1, 1] },
    { pos: [1, 0, 0], size: [1, 1, 1] },
    { pos: [0.5, -0.5, 0], size: [1, 1, 1] },
    // Bottom tip
    { pos: [0, -1, 0], size: [1, 1, 1] },
    { pos: [0, 0, 0], size: [1, 1, 1] } // Center block for fullness
  ]

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {heartShape.map((block, index) => (
        <Block
          key={index}
          position={block.pos}
          size={block.size}
          color={color}
        />
      ))}
    </group>
  )
}

function Vase() {
  const vaseBlocks = []
  const vaseSize = 0.3
  const vaseHeight = 5
  const vaseRadius = 2.5

  // Vazo desen renkleri
  const vaseColors = {
    main: "#4a4a4a",
    pattern: "#5a5a5a",
    highlight: "#6a6a6a",
    base: "#3a3a3a"
  }

  // Vazo gövdesi ve desenler
  for (let y = 0; y < vaseHeight; y++) {
    const radius = vaseRadius - (y * 0.4)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const x = Math.cos(angle) * radius * vaseSize
      const z = Math.sin(angle) * radius * vaseSize
      
      let color = vaseColors.main
      if (i % 3 === 0) color = vaseColors.pattern
      if (y % 2 === 0 && i % 4 === 0) color = vaseColors.highlight

      vaseBlocks.push(
        <Block 
          key={`vase-${y}-${i}`}
          position={[x, -2 - (y * vaseSize), z]}
          size={[vaseSize, vaseSize, vaseSize]}
          color={color}
        />
      )
    }
  }

  // Vazo tabanı
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      if (Math.sqrt(x*x + z*z) <= 2.5) {
        vaseBlocks.push(
          <Block 
            key={`vase-base-${x}-${z}`}
            position={[x * vaseSize, -2 - (vaseHeight * vaseSize), z * vaseSize]}
            size={[vaseSize, vaseSize, vaseSize]}
            color={vaseColors.base}
          />
        )
      }
    }
  }

  // Su efekti - Kaldırıldı
  /*
  const waterBlocks = []
  const waterLevel = -0.5 
  const waterRadius = 2.2

  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      if (Math.sqrt(x*x + z*z) <= waterRadius) {
        waterBlocks.push(
          <Water 
            key={`water-${x}-${z}`}
            position={[x * vaseSize, waterLevel, z * vaseSize]}
            size={[vaseSize, vaseSize * 0.5, vaseSize]}
          />
        )
      }
    }
  }
  */

  return (
    <group>
      {vaseBlocks}
      {/* waterBlocks */}
    </group>
  )
}

function FlowerArrangement({ season = 'spring', colors = [], numFlowers = 15 }) {
  const groupRef = useRef()
  const flowerTypes = ['rose', 'daisy', 'tulip']
  const radius = 0.9; // Adjusted for flowers to be slightly outside the vase
  const flowerY = -1.95; // Adjusted to bring flower heads up while keeping stems buried

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Flowers */}
      {Array.from({ length: numFlowers }).map((_, i) => {
        let x, z;
        // Calculate angle always, it's used for baseRotationY
        const angle = (i / numFlowers) * Math.PI * 2; 

        if (numFlowers === 1) {
          x = 0; // Center the single flower
          z = 0; // Center the single flower
        } else {
          // Add slight randomness to x and z
          x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.08
          z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.08
        }

        const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)]
        const color = colors[Math.floor(Math.random() * colors.length)] || '#ff0000'
        
        const tiltAngleX = (Math.random() - 0.5) * Math.PI / 4; // Random tilt between -PI/8 and PI/8

        return (
          <Flower
            key={i}
            position={[x, flowerY, z]}
            type={type}
            color={color}
            baseRotationY={numFlowers === 1 ? 0 : angle} // angle is always defined here
            tiltAngleX={tiltAngleX} // Pass random tilt for X rotation
          />
        )
      })}
      <Vase />

      {/* Hearts around the arrangement */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const heartRadius = 2.5; // Distance from the center
        const heartX = Math.cos(angle) * heartRadius;
        const heartZ = Math.sin(angle) * heartRadius;
        const heartY = 0.5; // Adjust vertical position of hearts
        const heartScale = 0.3; // Adjust size of hearts

        // Select a random color for each heart from the CUSTOM_COLORS array
        const heartColor = CUSTOM_COLORS[Math.floor(Math.random() * CUSTOM_COLORS.length)];

        // Fallback in case CUSTOM_COLORS[index] is undefined (shouldn't happen if array is non-empty, but for robustness)
        const finalHeartColor = heartColor || '#FF0000'; 

        return (
          <Heart
            key={`heart-${i}`}
            position={[heartX, heartY, heartZ]}
            scale={heartScale}
            color={finalHeartColor} // Use the final (potentially fallback) color
          />
        );
      })}
    </group>
  )
}

export default FlowerArrangement 