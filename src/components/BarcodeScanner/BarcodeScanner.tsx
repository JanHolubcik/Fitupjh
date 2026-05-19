'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  // Use refs to track the last scan without triggering React re-renders
  const lastScannedCode = useRef<string | null>(null);
  const lastScannedTime = useRef<number>(0);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "barcode-reader", 
      { 
        fps: 10,
        qrbox: { width: 300, height: 150 }, 
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        const now = Date.now();
        
        // COOLDOWN LOGIC: 
        // If it sees the exact same barcode, force it to wait 3 seconds (3000ms) 
        // before allowing it to scan that same item again.
        if (
          decodedText === lastScannedCode.current && 
          (now - lastScannedTime.current) < 3000
        ) {
          return; // Silently ignore the duplicate scan
        }

        // Record this new scan's details
        lastScannedCode.current = decodedText;
        lastScannedTime.current = now;

    
        onScan(decodedText);
      },
      (errorMessage) => {
        // fires continuously when no barcode is found.
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner:", error);
      });
    };
  }, [onScan]);

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-md bg-white">
      <div id="barcode-reader" className="w-full border-none"></div>
    </div>
  );
}