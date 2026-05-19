'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const lastScannedCode = useRef<string | null>(null);
  const lastScannedTime = useRef<number>(0);


  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    let timeoutId: NodeJS.Timeout;

    const startScanner = () => {
      const container = document.getElementById("barcode-reader");
      if (!container) {
        return;
      }

      try {
        scanner = new Html5QrcodeScanner(
          "barcode-reader", 
          { 
            fps: 10, 
            qrbox: { width: 250, height: 150 }, 
            aspectRatio: 1.0,
          },
          false
        );

        scanner.render(
          (decodedText) => {
            const now = Date.now();
            if (
              decodedText === lastScannedCode.current && 
              (now - lastScannedTime.current) < 3000
            ) {
              return;
            }

            lastScannedCode.current = decodedText;
            lastScannedTime.current = now;
            onScan(decodedText);
          },
          (err) => {
            // Ignore routine frame errors
          }
        );
      } catch (err: any) {
        console.error("Scanner failed to mount:", err);
    
      }
    };


    timeoutId = setTimeout(startScanner, 300);

    // Cleanup function when you close the modal
    return () => {
      clearTimeout(timeoutId);
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error("Failed to clear scanner:", error);
        });
      }
    };
  }, [onScan]);

  return (
<div>
    <div 
      id="barcode-reader" 
      className="w-full h-full min-h-[150px] border-none rounded-xl overflow-hidden"
    />  
  </div>
  );
}