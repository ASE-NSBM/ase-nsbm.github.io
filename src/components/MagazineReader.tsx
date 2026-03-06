// @ts-nocheck
import { forwardRef, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

// Set worker path to use CDN (to avoid vite worker rollup issues)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageWrapperProps {
    pageNumber: number;
    width: number;
    height: number;
}

// Create a forwardRef wrapper for the page as required by react-pageflip
const PageWrapper = forwardRef<HTMLDivElement, PageWrapperProps>(
    ({ pageNumber, width, height }, ref) => {
        return (
            <div
                ref={ref}
                className="page bg-white shadow-2xl overflow-hidden flex justify-center items-center"
                style={{ width: `${width}px`, height: `${height}px` }}
            >
                <div className="w-full h-full flex justify-center items-center overflow-hidden">
                    <Page
                        pageNumber={pageNumber}
                        width={width * 1.5} /* Render at 1.5x for clarity */
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="pdf-page-wrapper flex justify-center items-center w-full h-full"
                        loading={
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <span className="animate-pulse">Loading Page {pageNumber}...</span>
                            </div>
                        }
                    />
                </div>
            </div>
        );
    }
);
PageWrapper.displayName = 'PageWrapper';

interface MagazineReaderProps {
    pdfUrl: string;
}

export default function MagazineReader({ pdfUrl }: MagazineReaderProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const updateDimensions = () => {
            // Remove margin entirely to maximize viewport
            const availableWidth = window.innerWidth;
            const availableHeight = window.innerHeight;

            // A4 Aspect Ratio exactly
            const A4_RATIO = 1.414;

            let targetHeight = availableHeight;
            let targetWidth = targetHeight / A4_RATIO;

            // Mobile & Desktop: Always 1 page (usePortrait={true})
            // If the calculated width is larger than available screen width,
            // we scale down by the width instead.
            if (targetWidth > availableWidth) {
                targetWidth = availableWidth;
                targetHeight = targetWidth * A4_RATIO;
            }

            setDimensions({ width: targetWidth, height: targetHeight });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // Don't render server-side
    if (!isClient || dimensions.width === 0) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex justify-center items-center w-full h-full"
                loading={
                    <div className="flex flex-col items-center justify-center h-screen space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-400"></div>
                        <div className="text-white text-xl font-bold tracking-tight">Loading Magazine...</div>
                    </div>
                }
            >
                {numPages > 0 && dimensions.width > 0 && (
                    <div className="flex justify-center items-center w-full h-full pb-8">
                        {/* @ts-ignore - react-pageflip typed as object */}
                        <HTMLFlipBook
                            width={dimensions.width}
                            height={dimensions.height}
                            size="fixed"
                            minWidth={200}
                            maxWidth={3000}
                            minHeight={300}
                            maxHeight={4000}
                            minZoom={1}
                            maxZoom={1}
                            showCover={true}
                            mobileScrollSupport={true}
                            className="flipbook shadow-2xl select-none"
                            style={{ margin: '0 auto' }}
                            drawShadow={true}
                            flippingTime={1000}
                            usePortrait={true} /* Force 1-page spread everywhere */
                            startPage={0}
                            swipeDistance={30}
                            clickEventForward={true}
                            useMouseEvents={true}
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <PageWrapper
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={dimensions.width}
                                    height={dimensions.height}
                                />
                            ))}
                        </HTMLFlipBook>
                    </div>
                )}
            </Document>

            {/* Overlay hint that fades out */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium text-sm md:text-base bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm pointer-events-none z-50 animate-[fadeOut_5s_ease-in-out_forwards]">
                Swipe or click on edges to turn pages
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                /* Ensure React PDF canvas is contained perfectly without clipping */
                .pdf-page-wrapper {
                     display: flex;
                     justify-content: center;
                     align-items: center;
                     width: 100% !important;
                     height: 100% !important;
                     overflow: hidden;
                }
                .pdf-page-wrapper canvas {
                     max-width: 100% !important;
                     max-height: 100% !important;
                     width: auto !important;
                     height: auto !important;
                     object-fit: contain;
                }
                
                @keyframes fadeOut {
                    0% { opacity: 1; }
                    70% { opacity: 1; }
                    100% { opacity: 0; display: none; }
                }
            `}} />
        </div>
    );
}
