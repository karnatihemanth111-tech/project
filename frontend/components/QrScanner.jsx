"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScanSuccess(decodedText);
          html5QrCode.stop();
        },
        (errorMessage) => {
          // scan errors are normal while searching — ignore
        }
      )
      .then(() => setIsStarted(true))
      .catch((err) => {
        onScanError?.("Camera access denied. Please allow camera permissions.");
      });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        id="qr-reader"
        className="w-full max-w-sm rounded-xl overflow-hidden border-2 border-blue-500"
      />
      {!isStarted && (
        <p className="text-gray-400 text-sm animate-pulse">Starting camera...</p>
      )}
    </div>
  );
}