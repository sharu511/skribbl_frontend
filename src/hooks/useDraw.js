import { useEffect, useState, useRef } from "react";

export const useDraw = (onDraw) => {
    const [mouseDown, setMouseDown] = useState(false);
    const canvasRef = useRef(null);
    const previousPoint = useRef(null);

    const onMouseDown = () => {
        setMouseDown(true);
    };

    // Function to resize the canvas
    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const { width, height } = rect;

        // Only set the canvas size if it has changed
        if (canvas.width !== width || canvas.height !== height) {
            const ctx = canvas.getContext('2d');
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');

            // Copy the current drawing to the temporary canvas
            tempCtx.drawImage(canvas, 0, 0);

            // Set the new dimensions
            canvas.width = width;
            canvas.height = height;

            // Redraw the previous content onto the resized canvas
            ctx.drawImage(tempCanvas, 0, 0);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (!mouseDown) return;
            const currentPoint = computePoints(e);
            const ctx = canvasRef.current?.getContext('2d');

            if (!ctx || !currentPoint) return;

            onDraw({ ctx, currentPoint, previousPoint: previousPoint.current });
            previousPoint.current = currentPoint;
        };

        const computePoints = (e) => {
            const canvas = canvasRef.current;

            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            return { x, y };
        };

        const mouseUpHandler = () => {
            setMouseDown(false);
            previousPoint.current = null;
        };

        canvasRef.current?.addEventListener('mousemove', handler);
        window.addEventListener('mouseup', mouseUpHandler);

        // Resize canvas on mount
        resizeCanvas();

        // Resize canvas on window resize
        window.addEventListener('resize', resizeCanvas);

        // Cleanup
        return () => {
            canvasRef.current?.removeEventListener('mousemove', handler);
            window.removeEventListener('mouseup', mouseUpHandler);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [mouseDown, onDraw]);

    return { canvasRef, onMouseDown };
};
