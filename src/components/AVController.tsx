import React from 'react'
import {name} from "next/dist/telemetry/ci-info";

export function AVController() {
    const [file, setFile] = React.useState<{ file: File, playing?: boolean, audioSource?: AudioBufferSourceNode, audioAnalyzer?: AnalyserNode, audioArray?: Uint8Array} | null>(null)
    function loadFile(e: React.FormEvent<HTMLInputElement>) {
        if (e.currentTarget.files === null) {
            throw new Error("No file uploaded")
        }
        const inputFile = e.currentTarget.files[0]

        setFile({file:inputFile})
    }

    return (
        <>
        <input type="file" onChange={loadFile}/>
        <button onClick={play}>Start/Stop</button>
        </>
    )


    async function play(e: React.FormEvent<HTMLButtonElement>) {
        if (file == null) {
            throw new Error('No file was uploaded')
        }

        file.playing ? file.playing = true : file.playing = false

        if (file.playing) {

            const audioContext = new AudioContext()
            const bufferArray = await file.file.arrayBuffer()
            // @ts-ignore
            const audioData = await file.audioContext.decodeAudioData(bufferArray)
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
            file.audioSource = source
        }
        else {
            if (file.audioSource == undefined) {
                throw new Error("No audio source!")
            }

            file.audioSource.stop()

        }
    }

}






