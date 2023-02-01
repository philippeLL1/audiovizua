import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import {useTexture, OrbitControls} from '@react-three/drei'
import React from "react";

const SPHERE_RADIUS: number = 2.5

interface AudioInfo {
    freqArray: Uint8Array
    analyser: AnalyserNode
}

export default function Scene(props: AudioInfo) {
    return <div style={{width: "100vw", height: "100vh"}}>
    <Canvas>
        <ambientLight intensity={0.4} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <SphereMesh freqArray={props.freqArray} analyser={props.analyser}></SphereMesh>
        <OrbitControls></OrbitControls>
    </Canvas>
    </div>
}

function SphereMaterial() {
    const colorMap = useTexture('icons8-mandala.svg')
    return <>
        <meshStandardMaterial map={colorMap} />
    </>
}

function SphereGeometry() {
    return <>
        <sphereGeometry args={[SPHERE_RADIUS]} />
    </>
}

function SphereMesh({ freqArray, analyser }: AudioInfo) {
    const sphere  = React.useRef<Mesh>(null!)

    let i = 1
    useFrame(() => {
        // This factor will alternate between growing and shrinking the sphere
        i *= (-1)

        // Loads the frequency information for this particular frame
        analyser.getByteFrequencyData(freqArray)

        // Frequency choices
        let freqX = freqArray[100]
        let freqY = freqArray[500]
        let freqZ = freqArray[900]

        // Scaling
        sphere.current.scale.x += freqX * 0.001 * i
        sphere.current.scale.y += freqY * 0.001 * i
        sphere.current.scale.z += freqZ * 0.001 * i

        // Rotating
        // sphere.current.rotation.y += freqY * 0.001
        // sphere.current.rotation.x += freqZ * 0.0001
    })

     return <>
         <mesh ref={sphere}>
            <SphereGeometry></SphereGeometry>
            <SphereMaterial></SphereMaterial>
         </mesh>
     </>
}