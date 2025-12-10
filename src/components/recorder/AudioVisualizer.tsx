import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
    stream: MediaStream | null
    isRecording: boolean
}

export default function AudioVisualizer({ stream, isRecording }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const analyserRef = useRef<AnalyserNode | null>(null)
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

    useEffect(() => {
        if (!stream || !canvasRef.current || !isRecording) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            return
        }

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = audioContext.createAnalyser()

        try {
            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)

            analyser.fftSize = 256
            const bufferLength = analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            sourceRef.current = source
            analyserRef.current = analyser

            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            const draw = () => {
                animationRef.current = requestAnimationFrame(draw)
                analyser.getByteFrequencyData(dataArray)

                ctx.fillStyle = 'rgb(0, 0, 0)'
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                const barWidth = (canvas.width / bufferLength) * 2.5
                let barHeight
                let x = 0

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 2

                    // Gradient or solid color
                    ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

                    x += barWidth + 1
                }
            }

            draw()

            return () => {
                if (animationRef.current) cancelAnimationFrame(animationRef.current)
                if (audioContext.state !== 'closed') audioContext.close()
            }
        } catch (err) {
            console.error('Error in visualizer:', err)
        }
    }, [stream, isRecording])

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={150}
            className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm"
        />
    )
}
