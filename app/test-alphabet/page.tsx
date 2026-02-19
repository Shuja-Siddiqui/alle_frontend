"use client";

import { useState } from "react";
import { AlphabetDisplay } from "../../components/AlphabetDisplay";

export default function TestAlphabetPage() {
  const [inputText, setInputText] = useState("apple");

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen font-sans p-8"
      style={{
        background: "linear-gradient(121deg, #1D2948 -2.28%, #141D33 21.31%, #0F1628 33.91%, #20082A 92.75%)",
      }}
    >
      <div className="w-full max-w-4xl">
        {/* Title */}
        <h1
          className="text-center mb-8"
          style={{
            color: "#FFF",
            fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            fontSize: "48px",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Alphabet Display Test
        </h1>

        {/* Input Section */}
        <div className="mb-12">
          <label
            htmlFor="text-input"
            className="block mb-4"
            style={{
              color: "#FFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            Enter word, alphabet, or sentence:
          </label>
          <input
            id="text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type here..."
            className="w-full px-4 py-3 rounded-lg"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "2px solid #E451FE",
              color: "#FFF",
              fontSize: "18px",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
            }}
          />
          <p
            className="mt-2 text-sm"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Try: "apple", "A", "I have car", "HELLO"
          </p>
        </div>

        {/* Display Section - Three Versions */}
        <div className="space-y-12">
          {/* Default Version */}
          <div className="bg-black/30 p-6 rounded-lg border border-purple-500/30">
            <h2
              className="mb-6 text-center"
              style={{
                color: "#FFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Default Version
            </h2>
            <div className="flex justify-center">
              <AlphabetDisplay
                text={inputText}
                variant="default"
                letterWidth={80}
                letterHeight={80}
                gap={8}
                spaceHandling="spacer"
              />
            </div>
          </div>

          {/* Done Version */}
          <div className="bg-black/30 p-6 rounded-lg border border-green-500/30">
            <h2
              className="mb-6 text-center"
              style={{
                color: "#33FFAE",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Done Version
            </h2>
            <div className="flex justify-center">
              <AlphabetDisplay
                text={inputText}
                variant="done"
                letterWidth={80}
                letterHeight={80}
                gap={8}
                spaceHandling="spacer"
              />
            </div>
          </div>

          {/* Error Version */}
          <div className="bg-black/30 p-6 rounded-lg border border-red-500/30">
            <h2
              className="mb-6 text-center"
              style={{
                color: "#FA1D6E",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Error Version
            </h2>
            <div className="flex justify-center">
              <AlphabetDisplay
                text={inputText}
                variant="error"
                letterWidth={80}
                letterHeight={80}
                gap={8}
                spaceHandling="spacer"
              />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 rounded-lg bg-black/20 border border-white/10">
          <h3
            className="mb-4"
            style={{
              color: "#FFF",
              fontFamily: "var(--font-orbitron), system-ui, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Current Input:
          </h3>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: "monospace",
              fontSize: "16px",
            }}
          >
            "{inputText}"
          </p>
          <p
            className="mt-4 text-sm"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            Characters: {inputText.length} | Letters: {inputText.replace(/[^a-zA-Z]/g, "").length}
          </p>
        </div>
      </div>
    </div>
  );
}




