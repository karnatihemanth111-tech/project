"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Must load dynamically — html5-qrcode uses browser APIs
const QrScanner = dynamic(() => import("@/components/QrScanner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading camera...
    </div>
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function QrScannerPage() {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScanSuccess = useCallback(async (decodedText) => {
    setScanning(false);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/qr/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: decodedText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid QR code.");
      } else {
        setResult(data.location);
      }
    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setScanning(true);
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white text-xl">←</Link>
        <div>
          <h1 className="text-lg font-bold">QR Scanner</h1>
          <p className="text-gray-400 text-xs">Scan a campus QR code to navigate</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Scanner */}
        {scanning && (
          <>
            <div className="text-center text-gray-400 text-sm">
              Point your camera at a campus QR code
            </div>
            <QrScanner
              onScanSuccess={handleScanSuccess}
              onScanError={(msg) => { setError(msg); setScanning(false); }}
            />
            {/* Corners overlay hint */}
            <div className="flex justify-center">
              <div className="text-xs text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">
                🔍 Scanning...
              </div>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Looking up location...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              ❌ {error}
            </div>
            <button
              onClick={handleReset}
              className="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="flex flex-col gap-4">
            {/* Success card */}
            <div className="bg-green-900/30 border border-green-700 rounded-xl p-5 flex flex-col gap-2">
              <div className="text-green-400 text-xs font-semibold uppercase tracking-wider">
                ✅ Location Found
              </div>
              <h2 className="text-2xl font-bold">{result.name}</h2>
              {result.description && (
                <p className="text-gray-300 text-sm">{result.description}</p>
              )}
              {result.type && (
                <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full w-fit">
                  {result.type}
                </span>
              )}
            </div>

            {/* Info grid */}
            {(result.floor || result.hours || result.contact) && (
              <div className="bg-gray-900 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                {result.floor && (
                  <div>
                    <p className="text-gray-500 text-xs">Floor</p>
                    <p className="text-white font-medium">{result.floor}</p>
                  </div>
                )}
                {result.hours && (
                  <div>
                    <p className="text-gray-500 text-xs">Hours</p>
                    <p className="text-white font-medium">{result.hours}</p>
                  </div>
                )}
                {result.contact && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Contact</p>
                    <p className="text-white font-medium">{result.contact}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href={`/map?destination=${encodeURIComponent(result.name)}`}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-center py-3 rounded-xl font-semibold transition"
              >
                🗺 Get Directions
              </Link>
              <button
                onClick={handleReset}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl transition text-sm"
              >
                Scan Again
              </button>
            </div>
          </div>
        )}

        {/* Instructions (shown when idle) */}
        {scanning && (
          <div className="bg-gray-900 rounded-xl p-4 mt-2">
            <p className="text-gray-400 text-xs font-semibold uppercase mb-2">How to use</p>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Find QR code stickers placed around campus buildings</li>
              <li>• Hold your phone steady over the code</li>
              <li>• You'll be taken directly to that location's info</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}