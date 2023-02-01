import React from 'react'
import Scene from "@/components/SphereObject";
import {Environment, OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";

interface FileInfo {
    file?: File
    playing?: boolean
    audioSource?: AudioBufferSourceNode
    audioAnalyzer?: AnalyserNode
    audioArray?: Uint8Array
}

export default function AVController() {
    const [file, setFile] = React.useState< FileInfo | null>(null)

    function loadFile(e: React.FormEvent<HTMLInputElement>) {
        if (e.currentTarget.files === null) {
            throw new Error("No file uploaded")
        }
        const inputFile = e.currentTarget.files[0] ?? (() => {throw new Error("No file!")})

        setFile({file:inputFile, playing:false})
    }

    return (
        <>
        <input type="file" onChange={loadFile}/>
        <button onClick={play}>Start/Stop</button>
        <Sphere playing={file?.playing}></Sphere>
        </>
    )


    async function play(e: React.FormEvent<HTMLButtonElement>) {
        if (file == null || file.file == undefined) {
            throw new Error('No file was uploaded')
        }

        if (!file.playing) {

            const audioContext = new AudioContext()
            const bufferArray = await file.file.arrayBuffer()
            // @ts-ignore
            const audioData = await audioContext.decodeAudioData(bufferArray)
            // Create the source node
            const source = audioContext.createBufferSource()
            source.buffer = audioData

            // Create the analyzer node
            const analyzer = audioContext.createAnalyser()
            analyzer.fftSize = 2048
            const bufferLength = analyzer.frequencyBinCount
            const freqArray = new Uint8Array(bufferLength)

            source.connect(analyzer)
            analyzer.connect(audioContext.destination)
            source.start()


            setFile({file:file.file, playing: true, audioSource: source, audioAnalyzer: analyzer, audioArray: freqArray})
        }
        else {
            if (file.audioSource == undefined) {
                throw new Error("No audio source!")
            }

            file.audioSource.stop()
            setFile({file:file.file, playing: false})

        }
    }

    function Sphere({playing}: {playing: boolean | undefined}) {

        if (playing) {
            return <><Scene analyser={file?.audioAnalyzer!} freqArray={file?.audioArray!}></Scene></>
        }
        return (
        <div style={{width: "100vw", height: "100vh"}}>
            <Canvas camera={{position: [0, 40, 0]}}>
                <ambientLight intensity={3.0} />
                <directionalLight color="white" position={[0, 0, 5]} intensity={2.0} />
                <OrbitControls></OrbitControls>
                <Environment
                    files='environments/NorwayForest.hdr'
                    background>
                </Environment>
        </Canvas>
        </div>)

    }

}





