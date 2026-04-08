"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function EmergencyPage() {
  const [emergencyData, setEmergencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("contacts");

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/emergency/all`
      );
      const data = await response.json();
      setEmergencyData(data);
    } catch (error) {
      console.error("Error fetching emergency data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading emergency information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-red-900/20 border-b border-red-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-red-400 flex items-center gap-3">
                <span className="text-4xl">🚨</span>
                Emergency
              </h1>
              <p className="text-gray-400 mt-2">
                Quick access to emergency contacts and safety information
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Emergency Banner */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">
                In case of emergency, call Campus Security immediately
              </span>
            </div>
            <button
              onClick={() => handleCall("+91-9876543210")}
              className="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              📞 Call Security Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("contacts")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "contacts"
                ? "text-red-400 border-b-2 border-red-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📞 Emergency Contacts
          </button>
          <button
            onClick={() => setActiveTab("safety")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "safety"
                ? "text-red-400 border-b-2 border-red-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🛡️ Safety Tips
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "contacts" && (
          <div className="space-y-8">
            {emergencyData?.contacts?.map((category) => (
              <div key={category.id}>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {category.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.contacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className={`bg-gray-800/50 backdrop-blur-sm border rounded-lg p-6 hover:border-red-500/50 transition-all ${
                        contact.priority === 1
                          ? "border-red-500/30"
                          : "border-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{contact.icon}</span>
                          <div>
                            <h3 className="font-semibold text-white">
                              {contact.name}
                            </h3>
                            {contact.priority === 1 && (
                              <span className="text-xs text-red-400 font-semibold">
                                PRIORITY
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        {contact.description}
                      </p>
                      <button
                        onClick={() => handleCall(contact.phone)}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        📞 {contact.phone}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "safety" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyData?.safetyTips?.map((category) => (
              <div
                key={category.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-red-500/50 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span className="text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assembly Points Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-700/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
            <span>📍</span>
            Emergency Assembly Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
            <div>
              <p className="font-semibold text-white">Main Gate Area</p>
              <p className="text-sm">Primary assembly point for all blocks</p>
            </div>
            <div>
              <p className="font-semibold text-white">Sports Ground</p>
              <p className="text-sm">Secondary assembly point</p>
            </div>
            <div>
              <p className="font-semibold text-white">Library Lawn</p>
              <p className="text-sm">Tertiary assembly point</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}