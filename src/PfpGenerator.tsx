import { useState, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';
import warp from '/warp.jpg';
import { Cover } from './components/ui/cover';

// A simple hook to detect when the button is hovered
const useHover = (): [boolean, { onMouseEnter: () => void; onMouseLeave: () => void }] => {
    const [isHovered, setIsHovered] = useState(false);
    const hoverProps = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };
    return [isHovered, hoverProps];
};

const PfpGenerator = () => {
    const [foregroundFile, setForegroundFile] = useState<File | null>(null);
    const [generatedPfp, setGeneratedPfp] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isHovered, hoverProps] = useHover();

    const shiningLightBackground = warp;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForegroundFile(e.target.files[0]);
            setGeneratedPfp(null);
        }
    };

    const generatePfp = async () => {
        if (!foregroundFile) {
            alert('Please select an image first!');
            return;
        }

        setIsLoading(true);
        try {
            // Remove the background from the user's image using the free library
            const imageBlob = await removeBackground(foregroundFile);
            const removedBgImageUrl = URL.createObjectURL(imageBlob);

            // Draw the final PFP on the canvas
            drawCanvas(removedBgImageUrl);
        } catch (error) {
            console.error('Failed to remove background:', error);
            alert('Could not process the image. Please try another one.');
        } finally {
            setIsLoading(false);
        }
    };

    const drawCanvas = (foregroundSrc: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const canvasSize = 512;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const bg = new Image();
        bg.crossOrigin = 'Anonymous';
        bg.src = shiningLightBackground;
        bg.onload = () => {
            // Draw the shining light background
            ctx.drawImage(bg, 0, 0, canvasSize, canvasSize);

            const fg = new Image();
            fg.crossOrigin = 'Anonymous';
            fg.src = foregroundSrc;
            fg.onload = () => {
                // Draw the user's image (with background removed) on top
                ctx.drawImage(fg, 0, 0, canvasSize, canvasSize);
                setGeneratedPfp(canvas.toDataURL('image/png'));
            };
        };
    };

    return (
        <div className="bg-[#111111] text-white p-12 rounded-2xl max-w-lg w-full text-center shadow-2xl border border-gray-800 font-anton">
            <h1 className="text-4xl mb-2 text-white">
                <Cover>Your $Lightspeed Identity Starts Here</Cover>
            </h1>
            <p className="text-gray-400 mb-8 text-lg">
                Upload a pic. Watch it transform. Stand out on-chain.
            </p>

            <div className="mb-8 flex flex-col items-center gap-5">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-white bg-gray-800 border border-gray-600 rounded-lg p-3 w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black hover:file:bg-gray-200"
                />
                <button
                    onClick={generatePfp}
                    disabled={isLoading}
                    className={`bg-white text-black border-none py-3 px-7 rounded-lg text-lg cursor-pointer w-full transition-all duration-200 ${isHovered && !isLoading ? 'bg-gray-200 transform scale-105' : ''
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    {...hoverProps}
                >
                    {isLoading ? 'PROCESSING...' : 'LAUNCH MY LOOK'}
                </button>
            </div>

            <canvas ref={canvasRef} className="hidden"></canvas>

            {generatedPfp && !isLoading && (
                <div className="mt-5 flex flex-col items-center">
                    <h2 className="text-white text-xl mb-4">
                        YOUR PFP IS READY
                    </h2>
                    <img
                        src={generatedPfp}
                        alt="Generated Profile Picture"
                        className="w-44 h-44 rounded-xl mb-6 object-cover border-2 border-white"
                    />
                    <a
                        href={generatedPfp}
                        download="warp-pfp.png"
                        className="bg-white text-black py-3 px-7 rounded-lg no-underline transition-opacity duration-200 hover:opacity-80"
                    >
                        DOWNLOAD IMAGE
                    </a>
                </div>
            )}
        </div>
    );
};

export default PfpGenerator;