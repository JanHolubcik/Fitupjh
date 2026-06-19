import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { Scanner, IScannerError } from "@yudiel/react-qr-scanner";

type NativeBarcode = {
  rawValue: string;
  format: string;
};

type BarcodeDetectorInstance = {
  detect(video: HTMLVideoElement): Promise<NativeBarcode[]>;
};

type BarcodeDetectorConstructor = {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance;
  getSupportedFormats(): Promise<string[]>;
};

type ExtendedWindow = {
  BarcodeDetector?: BarcodeDetectorConstructor;
} & Window;

type BarcodeScannerProps = {
  onScan: (detectedCodes: { rawValue: string }[]) => void;
  onError: (error: IScannerError) => void;
  constraints?: ComponentProps<typeof Scanner>["constraints"];
  formats?: ComponentProps<typeof Scanner>["formats"];
};

const extendedWindow =
  typeof window !== "undefined"
    ? (window as unknown as ExtendedWindow)
    : undefined;

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  constraints = { facingMode: "environment" },
  formats = ["ean_13", "ean_8", "upc_a"],
}) => {
  const [useNative, setUseNative] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      if (extendedWindow?.BarcodeDetector) {
        try {
          const supported =
            await extendedWindow.BarcodeDetector.getSupportedFormats();
          // Check if at least one format is supported natively
          const hasRequiredFormat = (formats || []).some((f) =>
            supported.includes(f),
          );
          setUseNative(hasRequiredFormat);
        } catch (e) {
          console.warn(
            "Failed to query supported barcode formats, falling back to WebAssembly scanner:",
            e,
          );
          setUseNative(false);
        }
      } else {
        setUseNative(false);
      }
    };
    checkSupport();
  }, [formats]);

  useEffect(() => {
    if (useNative !== true || !extendedWindow?.BarcodeDetector) return;

    let isScanning = true;
    const Detector = extendedWindow.BarcodeDetector;
    const barcodeDetector = new Detector({ formats: formats as string[] });

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: constraints,
          audio: false,
        });

        if (!isScanning) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.play().catch((err) => {
            console.error("Native scanner video playback failed:", err);
          });
        }

        const scanFrame = async () => {
          if (!isScanning) return;

          const video = videoRef.current;
          if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await barcodeDetector.detect(video);
              if (barcodes.length > 0 && isScanning) {
                // Return detected barcodes using same callback format as @yudiel/react-qr-scanner
                onScan(barcodes.map((b) => ({ rawValue: b.rawValue })));
              }
            } catch (err) {
              // Frame detection can fail occasionally during transitions, ignore
            }
          }
          animationFrameRef.current = requestAnimationFrame(scanFrame);
        };

        animationFrameRef.current = requestAnimationFrame(scanFrame);
      } catch (err) {
        const error = err as Error;
        let kind: IScannerError["kind"] = "unsupported";
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          kind = "permission-denied";
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          kind = "no-camera";
        } else if (
          error.name === "NotReadableError" ||
          error.name === "TrackStartError"
        ) {
          kind = "in-use";
        }
        onError({
          kind,
          message: error.message || "Native Camera API initialization failed.",
          cause: error,
        });
      }
    };

    startCamera();

    return () => {
      isScanning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useNative, constraints, formats, onScan, onError]);

  // Loading/detecting support state
  if (useNative === null) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-950 text-white gap-2">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium">
          Initializing camera...
        </span>
      </div>
    );
  }

  // Fallback to ZXing QR Scanner library
  if (!useNative) {
    return (
      <Scanner
        onScan={onScan}
        onError={onError}
        constraints={constraints}
        formats={formats}
        components={{
          onOff: true,
          torch: true,
          zoom: true,
          finder: true,
        }}
        scanDelay={800}
        retryDelay={250}
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
      />

      {/* Semi-transparent Backdrop Mask */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Target Scanning Window */}
      <div className="absolute w-64 h-64 border-2 border-dashed border-white/30 rounded-3xl pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Corners styling */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
      </div>
    </div>
  );
};
