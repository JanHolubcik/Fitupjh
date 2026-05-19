"use client";
import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from "@zxing/library";
import { BrowserCodeReader } from "@zxing/browser";

type Props = {
  onScan: (result: string) => void;
  onError?: (err: unknown) => void;
};

export const ChromeSafeScanner = ({ onScan, onError }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
 const hasScanned = useRef(false);

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
    ]);

    const reader = new BrowserMultiFormatReader(hints, 800);
    readerRef.current = reader;

    BrowserCodeReader.listVideoInputDevices().then((devices) => {
      // prefer back camera
      const back = devices.find(d => /back|rear|environment/i.test(d.label)) ?? devices[devices.length - 1];
      const deviceId = back?.deviceId;

      reader.decodeFromVideoDevice(deviceId ?? null, videoRef.current!, (result, err) => {
        if (result && !hasScanned.current) {
          hasScanned.current = true;
          reader.reset();
          onScan(result.getText());
        }
        // ignore NotFoundException — it fires constantly between frames
      });
    }).catch(onError);

    return () => {
      reader.reset();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};