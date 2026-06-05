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

import { WebCamera } from "@shivantra/react-web-camera";

export const ModalTakePicture = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const cameraRef = useRef<any>(null);
  
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCaptureAndAnalyze = async () => {
    if (cameraRef.current) {
      const photoBase64 = cameraRef.current.capture();
      if (!photoBase64) return;
      
      setImage(photoBase64);
      setLoading(true);
      setResult(null);

      try {
        const response = await fetch("/api/foodImageAI", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: photoBase64 }),
        });

        if (response.ok) {
          const data = await response.json();
          setResult(data);
        } else {
          console.error("Failed to analyze image");
        }
      } catch (error) {
        console.error("Error sending image for analysis:", error);
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
      <Button onPress={onOpen}>Photo</Button>
      <Modal
        placement="top"
        hideCloseButton
        size="3xl"
        className="max-h-[80vh] overflow-y-auto"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 1 },
          },
          transition: {
            enter: { duration: 0.15 }, // animate when opening
            exit: { duration: 0 }, // instant close
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Take a Picture of Food
              </ModalHeader>
              <ModalBody className="flex flex-col items-center gap-4 pb-6">
                {!image ? (
                  <>
                    <WebCamera
                      ref={cameraRef}
                      style={{ width: "100%", maxWidth: 320, height: 'auto', padding: 10 }}
                      videoStyle={{ borderRadius: 5, width: "100%", height: "auto" }}
                      className="camera-container flex justify-center w-full"
                      videoClassName="camera-video"
                      captureMode="back"
                      getFileName={() => `next-photo-${Date.now()}.jpeg`}
                      onError={(err) => console.error(err)}
                    />
                    <div className="flex gap-2">
                      <Button color="primary" onPress={handleCaptureAndAnalyze}>
                        Capture & Analyze
                      </Button>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Captured" className="rounded-md max-w-[320px] w-full" />
                    
                    {loading && (
                      <div className="flex flex-col items-center gap-2">
                        <Spinner size="lg" />
                        <p>Analyzing with Gemini...</p>
                      </div>
                    )}

                    {result && (
                      <div className="bg-default-100 p-4 rounded-md w-full max-w-[320px]">
                        <h3 className="font-bold text-lg mb-2">{result.name || "Analysis Result"}</h3>
                        <ul className="text-sm space-y-1">
                          <li><span className="font-semibold">Calories:</span> {result.calories_per_100g} kcal</li>
                          <li><span className="font-semibold">Protein:</span> {result.protein} g</li>
                          <li><span className="font-semibold">Carbs:</span> {result.carbohydrates} g</li>
                          <li><span className="font-semibold">Fat:</span> {result.fat} g</li>
                          <li><span className="font-semibold">Sugar:</span> {result.sugar} g</li>
                          <li><span className="font-semibold">Fiber:</span> {result.fiber} g</li>
                          <li><span className="font-semibold">Salt:</span> {result.salt} g</li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Button color="primary" onPress={handleReset}>
                        Take Another
                      </Button>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
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
