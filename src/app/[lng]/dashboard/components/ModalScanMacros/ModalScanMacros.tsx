import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { createWorker, Worker as TesseractWorker } from "tesseract.js";
import { WebCamera } from "@shivantra/react-web-camera";
import { useT } from "next-i18next/client";

const parseMacros = (text: string) => {
  const extractNumber = (pattern: RegExp) => {
    const match = text.match(pattern);
    return match ? parseFloat(match[1].replace(",", ".")) : 0;
  };

  return {
    calories_per_100g: extractNumber(
      /(?:calories|kcal|energie|energy)[^\d]*(\d+[.,]?\d*)/i,
    ),
    protein: extractNumber(/(?:protein|bielkoviny)[^\d]*(\d+[.,]?\d*)/i),
    carbohydrates: extractNumber(
      /(?:carbohydrate|carbs|sacharidy)[^\d]*(\d+[.,]?\d*)/i,
    ),
    fat: extractNumber(/(?:total fat|fat|tuky)[^\d]*(\d+[.,]?\d*)/i),
    sugar: extractNumber(/(?:sugar|cukry)[^\d]*(\d+[.,]?\d*)/i),
    fiber: extractNumber(/(?:fiber|vláknina)[^\d]*(\d+[.,]?\d*)/i),
    salt: extractNumber(/(?:salt|soľ)[^\d]*(\d+[.,]?\d*)/i),
  };
};

export const ModalScanMacros = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { t } = useT("dashboard");
  const cameraRef = useRef<any>(null);

  const [result, setResult] = useState<any>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);

  const workerRef = useRef<TesseractWorker | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      const initTesseract = async () => {
        setIsWorkerReady(false);
        const worker = await createWorker(["eng", "slk"]);
        workerRef.current = worker;
        setIsWorkerReady(true);
        startLiveScanning();
      };
      initTesseract();
    } else {
      // Cleanup when modal closes
      stopLiveScanning();
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setResult(null);
    }

    return () => {
      stopLiveScanning();
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [isOpen]);

  const startLiveScanning = () => {
    scanIntervalRef.current = setInterval(async () => {
      if (isProcessingRef.current || !workerRef.current) return;

      const videoElement = document.querySelector(
        ".camera-video",
      ) as HTMLVideoElement;
      if (!videoElement) return;

      isProcessingRef.current = true;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const frameBase64 = canvas.toDataURL("image/jpeg", 0.8);

        // Run OCR on the frame
        const {
          data: { text },
        } = await workerRef.current.recognize(frameBase64);
        console.log("Live Scan Text:", text);

        // Parse extracted text
        const extractedData = parseMacros(text);

        // If we found Calories, assume we got a good read
        if (extractedData.calories_per_100g > 0) {
          setResult(extractedData);
          stopLiveScanning();
        }
      } catch (error) {
        console.error("Live scan error:", error);
      } finally {
        isProcessingRef.current = false; // Unlock process
      }
    }, 1500);
  };

  const stopLiveScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const handleReset = () => {
    setResult(null);
    startLiveScanning(); // Restart loop
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        {t("takePictureModal.photo") || "Scan Label"}
      </Button>

      <Modal
        placement="top"
        hideCloseButton
        size="3xl"
        className="max-h-[80vh] overflow-y-auto"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("takePictureModal.takePictureTitle") ||
                  "Scanning Nutrition Label..."}
              </ModalHeader>

              <ModalBody className="flex flex-col items-center gap-4 pb-6">
                {!result && (
                  <div className="relative w-full max-w-[320px] flex flex-col items-center">
                    <WebCamera
                      ref={cameraRef}
                      style={{ width: "100%", height: "auto" }}
                      videoStyle={{
                        borderRadius: 8,
                        width: "100%",
                        height: "auto",
                      }}
                      className="camera-container w-full"
                      videoClassName="camera-video"
                      captureMode="back"
                    />

                    <div className="mt-4 flex flex-col items-center gap-2">
                      {!isWorkerReady ? (
                        <>
                          <Spinner size="sm" />
                          <p className="text-sm text-default-500">
                            Loading AI Engine...
                          </p>
                        </>
                      ) : (
                        <>
                          <Spinner size="sm" color="success" />
                          <p className="text-sm text-default-500">
                            Scanning in real-time... point at label.
                          </p>
                        </>
                      )}
                    </div>

                    <Button
                      color="danger"
                      variant="light"
                      onPress={onClose}
                      className="mt-4"
                    >
                      {t("takePictureModal.cancel") || "Cancel"}
                    </Button>
                  </div>
                )}

                {result && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="bg-success-50 border border-success-200 p-4 rounded-md w-full max-w-[320px]">
                      <h3 className="font-bold text-lg text-success-700 mb-2">
                        {t("takePictureModal.analysisResult") ||
                          "Macros Extracted!"}
                      </h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex justify-between">
                          <span className="font-semibold">Calories:</span>{" "}
                          <span>{result.calories_per_100g} kcal</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-semibold">Protein:</span>{" "}
                          <span>{result.protein} g</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-semibold">Carbs:</span>{" "}
                          <span>{result.carbohydrates} g</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-semibold">Fat:</span>{" "}
                          <span>{result.fat} g</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-semibold">Sugar:</span>{" "}
                          <span>{result.sugar} g</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-semibold">Fiber:</span>{" "}
                          <span>{result.fiber} g</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-semibold">Salt:</span>{" "}
                          <span>{result.salt} g</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button color="primary" onPress={handleReset}>
                        {t("takePictureModal.takeAnother") || "Rescan"}
                      </Button>
                      <Button color="success" onPress={onClose}>
                        Confirm & Save
                      </Button>
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
