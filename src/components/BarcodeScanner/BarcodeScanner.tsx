'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const lastScannedCode = useRef<string | null>(null);
  const lastScannedTime = useRef<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    let timeoutId: NodeJS.Timeout;

    const startScanner = () => {
      // Safety check: Ensure the modal actually rendered the div
      const container = document.getElementById("barcode-reader");
      if (!container) {
        setErrorMsg("Camera container not found in modal.");
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
        setErrorMsg(err.message || "Failed to load camera UI.");
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
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-lg bg-white">
      {errorMsg && (
        <div className="p-4 bg-red-100 text-red-700 text-sm font-semibold">
          Error: {errorMsg}
        </div>
      )}
      <div 
        id="barcode-reader" 
        className="w-full min-h-[300px] border-none"
      ></div>
    </div>
  );
}