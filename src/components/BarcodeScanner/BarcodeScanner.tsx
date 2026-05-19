'use client';

import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  useEffect(() => {
    // 1. Initialize the pure-JS scanner
    const scanner = new Html5QrcodeScanner(
      "barcode-reader", 
      { 
        fps: 15, 
        // A wider box is highly recommended for 1D barcodes like EAN/UPC
        qrbox: { width: 300, height: 150 }, 
        aspectRatio: 1.0,
      },
      false // Set to true if you want verbose logs in the console
    );

    // 2. Start rendering the camera UI and scanning
    scanner.render(
      (decodedText) => {
        // Success callback
        onScan(decodedText);
      },
      (errorMessage) => {
        // Failure callback (This fires constantly as it scans empty space, 
        // so it is best left empty or commented out to avoid console spam).
      }
    );

    // 3. React 19 Strict Mode Cleanup: safely unmount the camera
    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner:", error);
      });
    };
  }, [onScan]);

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-md bg-white">
      {/* The vanilla JS library will inject the camera feed directly into this div */}
      <div id="barcode-reader" className="w-full border-none"></div>
    </div>
  );
}