"use client";
import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type Props = {
  onScan: (result: string) => void;
  onError?: (err: unknown) => void;
};

const SCANNER_ID = "chrome-safe-scanner";

export const ChromeSafeScanner = ({ onScan, onError }: Props) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScanned = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        if (hasScanned.current) return;
        if (!decodedText) return;
        hasScanned.current = true;
        
        //scanner.stop().then(() => onScan(decodedText)).catch(() => onScan(decodedText));
      },
      () => {} // ignore per-frame failures, they're normal
    ).catch(onError);

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  // html5-qrcode needs a real DOM div with this id to mount into
  return <div id={SCANNER_ID} style={{ width: "100%" }} />;
};