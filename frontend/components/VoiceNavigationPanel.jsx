"use client";
import { useVoiceNavigation } from "@/app/hooks/useVoiceNavigation";

export default function VoiceNavigationPanel({ route = null, destination = "" }) {
  const {
    isSupported,
    isActive,
    isSpeaking,
    currentInstruction,
    voices,
    selectedVoice,
    volume,
    rate,
    setSelectedVoice,
    setVolume,
    setRate,
    toggleActive,
    announceRoute,
    announceStep,
    announceArrival,
    stopSpeaking,
  } = useVoiceNavigation();

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
        ⚠️ Voice navigation is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg
            ${isSpeaking ? "bg-white animate-pulse" : "bg-white/20"}`}>
            🔊
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Voice Navigation</p>
            <p className="text-blue-100 text-xs">
              {isActive ? (isSpeaking ? "Speaking..." : "Ready") : "Disabled"}
            </p>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleActive}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200
            ${isActive ? "bg-green-400" : "bg-white/30"}`}
          aria-label="Toggle voice navigation"
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
            ${isActive ? "translate-x-6" : "translate-x-0"}`} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Current instruction banner */}
        {currentInstruction && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-blue-500 text-lg mt-0.5">📍</span>
            <p className="text-blue-800 text-sm leading-relaxed">{currentInstruction}</p>
          </div>
        )}

        {/* Controls (only when active) */}
        {isActive && (
          <>
            {/* Voice selector */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Voice</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const v = voices.find((v) => v.name === e.target.value);
                  setSelectedVoice(v || null);
                }}
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Volume */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Volume — {Math.round(volume * 100)}%
              </label>
              <input
                type="range" min="0" max="1" step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Speed */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Speed — {rate.toFixed(1)}x
              </label>
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => route && destination
                  ? announceRoute(route, destination)
                  : announceStep("No route selected. Please search for a destination first.")}
                disabled={isSpeaking}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                  text-white text-sm font-medium rounded-xl py-2.5 transition-colors"
              >
                ▶ Announce Route
              </button>

              <button
                onClick={stopSpeaking}
                disabled={!isSpeaking}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40
                  text-gray-700 text-sm font-medium rounded-xl py-2.5 transition-colors"
              >
                ⏹ Stop
              </button>

              {destination && (
                <button
                  onClick={() => announceArrival(destination)}
                  className="col-span-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700
                    text-white text-sm font-medium rounded-xl py-2.5 transition-colors"
                >
                  🏁 Announce Arrival
                </button>
              )}
            </div>
          </>
        )}

        {/* Disabled state hint */}
        {!isActive && (
          <p className="text-xs text-gray-400 text-center">
            Toggle the switch above to enable voice announcements during navigation.
          </p>
        )}
      </div>
    </div>
  );
}
