import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PDFViewerProps {
    pdfBase64: string;
    title: string;
    onBack: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfBase64, title, onBack }) => {
    // Ensure the base64 string has the correct prefix
    const pdfSrc = pdfBase64.startsWith('data:application/pdf;base64,')
        ? pdfBase64
        : `data:application/pdf;base64,${pdfBase64}`;

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 hover:text-gray-300">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold truncate">{title}</h1>
                </div>
            </div>
            <div className="flex-1 bg-gray-700 p-4 flex justify-center overflow-hidden">
                <iframe
                    src={pdfSrc}
                    className="w-full h-full max-w-5xl bg-white rounded shadow-lg"
                    title="PDF Viewer"
                />
            </div>
        </div>
    );
};
