import React, { useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
// 1. Corrected the Tesseract import
import { createWorker } from "tesseract.js";
import { WebCamera } from "@shivantra/react-web-camera";
import { useT } from "next-i18next/client";

const fileToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// 2. Added a parsing function using Regex to find numbers near keywords
const parseMacros = (text: string) => {
  // Helper to extract the first number found after a regex match
  const extractNumber = (pattern: RegExp) => {
    const match = text.match(pattern);
    return match ? parseFloat(match[1]) : 0;
  };

  // The regex looks for the word, ignores spaces/colons, and captures the numbers.
  // Includes English and Slovak (sk) variations since you requested both!
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
  const cameraRef = useRef<any>(null);
  const { t } = useT("dashboard");

  const [image, setImage] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCaptureAndAnalyze = async () => {
    if (cameraRef.current) {
      const file = await cameraRef.current.capture();
      const photoBase64 = await fileToBase64(file);
      if (!photoBase64) return;

      setImage(photoBase64);
      setLoading(true);
      setResult(null);

      try {
        // 3. Initialize worker dynamically to prevent build issues
        const worker = await createWorker(["eng", "slk"]);

        // 4. Pass the actual captured image base64, not the hardcoded URL
        const {
          data: { text },
        } = await worker.recognize(photoBase64 as string);

        // Terminate worker to free up memory
        await worker.terminate();

        console.log("Raw text from camera:", text); // Helpful for debugging!

        // 5. Parse the raw text into structured data
        const extractedData = parseMacros(text);

        // 6. Set the result so your UI renders it
        setResult(extractedData);
      } catch (error) {
        console.error("Error recognizing text:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div>
      <Button onPress={onOpen}>{t("takePictureModal.photo")}</Button>
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
            /* ... Keep your exact UI code here (ModalHeader, ModalBody, etc) ... */
            /* The existing UI code you provided is perfectly fine and will just work now */
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("takePictureModal.takePictureTitle")}
              </ModalHeader>
              <ModalBody className="flex flex-col items-center gap-4 pb-6">
                {!image ? (
                  <>
                    <WebCamera
                      ref={cameraRef}
                      style={{
                        width: "100%",
                        maxWidth: 320,
                        height: "auto",
                        padding: 10,
                      }}
                      videoStyle={{
                        borderRadius: 5,
                        width: "100%",
                        height: "auto",
                      }}
                      className="camera-container flex justify-center w-full"
                      videoClassName="camera-video"
                      captureMode="back"
                      getFileName={() => `next-photo-${Date.now()}.jpeg`}
                      onError={(err) => console.error(err)}
                    />
                    <div className="flex gap-2">
                      <Button color="primary" onPress={handleCaptureAndAnalyze}>
                        {t("takePictureModal.captureAndAnalyze")}
                      </Button>
                      <Button color="danger" variant="light" onPress={onClose}>
                        {t("takePictureModal.cancel")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <img
                      src={image}
                      alt="Captured"
                      className="rounded-md max-w-[320px] w-full"
                    />

                    {loading && (
                      <div className="flex flex-col items-center gap-2">
                        <Spinner size="lg" />
                        <p>{t("takePictureModal.analyzing")}</p>
                      </div>
                    )}

                    {result && (
                      <div className="bg-default-100 p-4 rounded-md w-full max-w-[320px]">
                        <h3 className="font-bold text-lg mb-2">
                          {result.name || t("takePictureModal.analysisResult")}
                        </h3>
                        <ul className="text-sm space-y-1">
                          <li>
                            <span className="font-semibold">
                              {t("takePictureModal.macros.calories")}
                            </span>{" "}
                            {result.calories_per_100g} kcal
                          </li>
                          <li>
                            <span className="font-semibold">
                              {t("takePictureModal.macros.protein")}
                            </span>{" "}
                            {result.protein} g
                          </li>
                          <li>
                            <span className="font-semibold">
                              {t("takePictureModal.macros.carbs")}
                            </span>{" "}
                            {result.carbohydrates} g
                          </li>
                          <li>
                            <span className="font-semibold">
                              {t("takePictureModal.macros.fat")}
                            </span>{" "}
                            {result.fat} g
                          </li>
                          <li>
                            <span className="font-semibold">
                              {t("takePictureModal.macros.sugar")}
                            </span>{" "}
                            {result.sugar} g
                          </li>
                          <li>
                            <span className="font-semibold">
                              {t("takePictureModal.macros.fiber")}
                            </span>{" "}
                            {result.fiber} g
                          </li>
                          <li>
                            <span className="font-semibold">
                              {t("takePictureModal.macros.salt")}
                            </span>{" "}
                            {result.salt} g
                          </li>
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button color="primary" onPress={handleReset}>
                        {t("takePictureModal.takeAnother")}
                      </Button>
                      <Button color="danger" variant="light" onPress={onClose}>
                        {t("close")}
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
