/**
 * Example usage of AlphabetDisplay component
 * 
 * This file shows how to use the AlphabetDisplay component
 * in different scenarios.
 */

import { AlphabetDisplay } from "./AlphabetDisplay";

export function AlphabetDisplayExamples() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Example 1: Simple word */}
      <div>
        <h3>Word: "apple"</h3>
        <AlphabetDisplay text="apple" letterWidth={60} letterHeight={60} />
      </div>

      {/* Example 2: Sentence with spaces */}
      <div>
        <h3>Sentence: "I have car"</h3>
        <AlphabetDisplay
          text="I have car"
          letterWidth={50}
          letterHeight={50}
          gap={8}
          spaceHandling="spacer"
        />
      </div>

      {/* Example 3: Letters only (no spaces) */}
      <div>
        <h3>Letters only: "hello world"</h3>
        <AlphabetDisplay
          text="hello world"
          letterWidth={45}
          letterHeight={45}
          lettersOnly={true}
        />
      </div>

      {/* Example 4: With dash for spaces */}
      <div>
        <h3>With dash: "I have car"</h3>
        <AlphabetDisplay
          text="I have car"
          letterWidth={50}
          letterHeight={50}
          spaceHandling="dash"
        />
      </div>

      {/* Example 5: Single alphabet */}
      <div>
        <h3>Single letter: "A"</h3>
        <AlphabetDisplay text="A" letterWidth={80} letterHeight={80} />
      </div>

      {/* Example 6: Custom styling */}
      <div>
        <h3>Custom styled: "HELLO"</h3>
        <AlphabetDisplay
          text="HELLO"
          letterWidth={70}
          letterHeight={70}
          gap={12}
          className="bg-purple-500/20 p-4 rounded-lg"
          letterStyle={{
            filter: "drop-shadow(0 0 4px #E451FE)",
          }}
        />
      </div>
    </div>
  );
}




