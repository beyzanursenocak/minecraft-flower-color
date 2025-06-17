import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Grid
} from '@react-three/drei'
import FlowerArrangement from './components/FlowerArrangement'
import './App.css'

const SEASONS = {
  spring: {
    name: 'İlkbahar',
    colors: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#FF69B4'],
    flowerTypes: ['rose', 'daisy', 'tulip']
  },
  summer: {
    name: 'Yaz',
    colors: ['#FF4500', '#FF8C00', '#FFA500', '#FFD700', '#FF6347'],
    flowerTypes: ['rose', 'daisy']
  },
  autumn: {
    name: 'Sonbahar',
    colors: ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887'],
    flowerTypes: ['rose', 'daisy']
  },
  winter: {
    name: 'Kış',
    colors: ['#FFFFFF', '#F0F8FF', '#E6E6FA', '#D8BFD8', '#DDA0DD'],
    flowerTypes: ['rose', 'daisy']
  }
}

const CUSTOM_COLORS = [
  '#FF6B6B', // Soft Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage Green
  '#FFEEAD', // Cream
  '#D4A5A5', // Dusty Rose
  '#9B59B6', // Purple
  '#3498DB', // Blue
  '#E67E22', // Orange
  '#2ECC71'  // Green
]

const FLOWER_COUNTS = [1, 5, 10, 15, 20]; // Flower count options

function Scene({ selectedSeason, selectedColors, numFlowers }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls 
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.5}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
      
      {/* Ambient light for overall scene brightness */}
      <ambientLight intensity={0.6} />
      
      {/* Main directional light simulating sun */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Grid for Minecraft style */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={3.3}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      
      {/* Environment lighting */}
      <Environment 
        preset="sunset" 
        background={false}
        blur={0.8}
      />
      
      <FlowerArrangement 
        season={selectedSeason}
        colors={selectedColors}
        numFlowers={numFlowers}
      />
    </>
  )
}

function App() {
  const [selectedSeason, setSelectedSeason] = useState('spring')
  const [selectedColors, setSelectedColors] = useState([])
  const [numFlowers, setNumFlowers] = useState(15); // New state for flower count

  const handleSeasonChange = (season) => {
    setSelectedSeason(season)
    setSelectedColors(SEASONS[season].colors)
  }

  const handleColorToggle = (color) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color)
      } else {
        return [...prev, color]
      }
    })
  }

  return (
    <div className="app">
      <div className="menu left-menu">
        <h2>Mevsimler</h2>
        <div className="season-buttons">
          {Object.entries(SEASONS).map(([key, season]) => (
            <button
              key={key}
              className={`season-button ${selectedSeason === key ? 'active' : ''}`}
              onClick={() => handleSeasonChange(key)}
            >
              {season.name}
            </button>
          ))}
        </div>

        <h2>Renkler</h2>
        <div className="color-picker">
          {CUSTOM_COLORS.map((color) => (
            <button
              key={color}
              className={`color-button ${selectedColors.includes(color) ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorToggle(color)}
            />
          ))}
        </div>

        <h2>Çiçek Sayısı</h2>
        <div className="flower-count-buttons">
          {FLOWER_COUNTS.map((count) => (
            <button
              key={count}
              className={`flower-count-button ${numFlowers === count ? 'active' : ''}`}
              onClick={() => setNumFlowers(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene 
            selectedSeason={selectedSeason}
            selectedColors={selectedColors}
            numFlowers={numFlowers}
          />
        </Suspense>
      </Canvas>

      <div className="overlay top-center-overlay">
        <h1>Minecraft Çiçek Aranjmanı</h1>
        <p>Sevgilinize özel bu dijital çiçekleri sunun</p>
        <p className="instructions">Fare ile sürükleyerek çiçekleri döndürebilirsiniz</p>
      </div>
    </div>
  )
}

export default App 