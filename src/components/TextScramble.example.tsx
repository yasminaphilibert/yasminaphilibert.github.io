/**
 * TextScramble Component Usage Examples
 * 
 * This component recreates David Haz's iconic text scramble hover effect.
 * Hover over text and characters within a circular area scramble into random symbols.
 */

import TextScramble from "./TextScramble";

export const Examples = () => {
  return (
    <div className="space-y-12 p-12">
      {/* Basic Usage */}
      <div>
        <h2 className="text-2xl mb-4">Basic Usage</h2>
        <TextScramble>
          Hover over this text to see the scramble effect!
        </TextScramble>
      </div>

      {/* Heading Example */}
      <div>
        <h2 className="text-2xl mb-4">Heading Example</h2>
        <TextScramble as="h1" className="text-4xl font-bold">
          Futuristic Heading
        </TextScramble>
      </div>

      {/* Custom Scramble Percentage */}
      <div>
        <h2 className="text-2xl mb-4">50% Scramble (subtle effect)</h2>
        <TextScramble scramblePercentage={50} className="text-xl">
          Only half the characters in the radius will scramble
        </TextScramble>
      </div>

      {/* Custom Radius */}
      <div>
        <h2 className="text-2xl mb-4">Smaller Radius (50px)</h2>
        <TextScramble scrambleRadius={50} className="text-xl">
          The scramble area is now smaller
        </TextScramble>
      </div>

      {/* Custom Scramble Characters */}
      <div>
        <h2 className="text-2xl mb-4">Custom Scramble Characters</h2>
        <TextScramble 
          scrambleChars="01" 
          className="text-xl font-mono"
        >
          Binary scramble effect
        </TextScramble>
      </div>

      {/* Faster Animation */}
      <div>
        <h2 className="text-2xl mb-4">Faster Animation (20ms)</h2>
        <TextScramble scrambleSpeed={20} className="text-xl">
          This scrambles much faster
        </TextScramble>
      </div>

      {/* Paragraph Example */}
      <div>
        <h2 className="text-2xl mb-4">Paragraph Example</h2>
        <TextScramble as="p" className="text-lg leading-relaxed max-w-2xl">
          This is a longer paragraph that demonstrates how the scramble effect works
          with multiple lines of text. As you hover over different parts of the text,
          characters within the circular area will scramble into random symbols,
          creating a futuristic glitch effect perfect for sci-fi or Web3 websites.
        </TextScramble>
      </div>
    </div>
  );
};

export default Examples;
