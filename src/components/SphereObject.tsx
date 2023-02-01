import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import {useTexture, OrbitControls, Environment} from '@react-three/drei'
import React from "react";

const SPHERE_RADIUS: number = 2.5

interface AudioInfo {
    freqArray: Uint8Array
    analyser: AnalyserNode
}

export default function Scene(props: AudioInfo) {
    return <div style={{width: "100vw", height: "100vh"}}>
    <Canvas camera={{position: [0, 40, 0], rotation: [0, -60, 0]}}>
        <ambientLight intensity={3.0} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={2.0} />
        <SphereMesh freqArray={props.freqArray} analyser={props.analyser}></SphereMesh>
        <OrbitControls></OrbitControls>
        <Environment
            files='environments/NorwayForest.hdr'
            ground={{
                height: 30,
                radius: 60,
                scale: 100,
            }}>
        </Environment>
    </Canvas>
    </div>
}

function SphereMaterial() {
    const props = useTexture({
        map: 'woodSphere/BaseColor.jpg',
        normalMap: 'woodSphere/Normal.jpg',
        roughnessMap: 'woodSphere/Roughness.jpg',
        displacementMap: 'woodSphere/Height.jpg',
        aoMap: 'woodSphere/AmbientOcclusion.jpg',
    })
    return <>
        <meshStandardMaterial
            displacementScale={0.2}
            {...props} />
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
         <mesh ref={sphere} position={[0, 10, 0]}>
            <SphereGeometry></SphereGeometry>
            <SphereMaterial></SphereMaterial>
         </mesh>
     </>
}