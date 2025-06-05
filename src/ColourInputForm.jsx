import { useState } from 'react';
import chroma from 'chroma-js';
import ContrastChecker from './ContrastChecker';
import StyleGuidePreview from './StyleGuidePreview';
import ExportOptions from './ExportOptions';

/**
 * React component for creating and customizing a color palette with accessibility and color blindness simulation features.
 *
 * Allows users to define a set of labeled colors, select a default background color, and preview accessibility contrast. Supports adding, removing, and editing up to six custom colors, simulating various types of color blindness, and exporting the palette. Provides suggested accessible green and red colors based on the selected background.
 *
 * @returns {JSX.Element} The rendered color input form and preview interface.
 */
function ColourInputForm() {
  const [backgroundColour, setBackgroundColour] = useState('#FFFFFF');
  const [userColours, setUserColours] = useState([
    { id: 1, value: '#007BFF', label: 'Primary' },
    { id: 2, value: '#6C757D', label: 'Secondary' },
  ]);

  const [simulationModes, setSimulationModes] = useState([]);

  const toggleSimulation = (mode) => {
    setSimulationModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const addColour = () => {
    if (userColours.length >= 6) return;
    const newId = Math.max(...userColours.map((c) => c.id)) + 1;
    setUserColours([...userColours, { id: newId, value: '#888888', label: '' }]);
  };

  const removeColour = (id) => {
    if (userColours.length <= 2) return;
    setUserColours(userColours.filter((c) => c.id !== id));
  };

  const updateColour = (id, key, newValue) => {
    if (key === 'value' && !chroma.valid(newValue)) return;
    setUserColours(
      userColours.map((c) =>
        c.id === id ? { ...c, [key]: key === 'value' ? chroma(newValue).hex() : newValue } : c
      )
    );
  };

  const getRGB = (hex) => {
    try {
      return chroma(hex).rgb().join(', ');
    } catch {
      return '';
    }
  };

  const combinedColours = Object.fromEntries([
    ...userColours.map((c) => [
      c.label?.trim() ? c.label : `colour${c.id}`,
      { hex: c.value, label: c.label },
    ]),
    ['black', { hex: '#000000', label: 'Black' }],
    ['white', { hex: '#FFFFFF', label: 'White' }],
  ]);

  const suggestColour = (type, background) => {
    const hue = type === 'green' ? 120 : 0;
    let best = null;
    let bestRatio = 0;

    for (let s = 100; s >= 60; s -= 5) {
      for (let l = 10; l <= 90; l += 2) {
        const candidate = chroma.hsl(hue, s / 100, l / 100).hex();
        const ratio = chroma.contrast(candidate, background);
        if (ratio >= 7) {
          return { colour: candidate, ratio: ratio.toFixed(2) };
        }
        if (ratio > bestRatio) {
          best = candidate;
          bestRatio = ratio;
        }
      }
    }

    return { colour: best, ratio: bestRatio.toFixed(2) };
  };

  const suggestedGreen = suggestColour('green', backgroundColour);
  const suggestedRed = suggestColour('red', backgroundColour);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      <div>
        <h2>Define Your Palette</h2>

        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="backgroundColour">
            <strong>Default Background Colour</strong>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="backgroundColour"
              type="color"
              value={backgroundColour}
              onChange={(e) => setBackgroundColour(e.target.value)}
            />
            <input
              type="text"
              value={backgroundColour}
              onChange={(e) => {
                if (chroma.valid(e.target.value)) {
                  setBackgroundColour(chroma(e.target.value).hex());
                }
              }}
              style={{ width: '90px' }}
            />
            <code className="rgb-text">
              rgb({getRGB(backgroundColour)})
            </code>
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          {userColours.map((c, index) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder={`Label ${index + 1}`}
                value={c.label}
                onChange={(e) => updateColour(c.id, 'label', e.target.value)}
                style={{ flex: '1 1 auto' }}
              />
              <input
                type="color"
                value={c.value}
                onChange={(e) => updateColour(c.id, 'value', e.target.value)}
              />
              <input
                type="text"
                value={c.value}
                onChange={(e) => updateColour(c.id, 'value', e.target.value)}
                style={{ width: '90px' }}
              />
              <code className="rgb-text">rgb({getRGB(c.value)})</code>
              {userColours.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeColour(c.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          {userColours.length < 6 && (
            <button type="button" onClick={addColour} style={{ marginTop: '1rem' }}>
              + Add Another Colour
            </button>
          )}
        </form>

        <div style={{ marginTop: '2rem' }}>
          <label>
            <strong>Simulate Colour Blindness</strong>
          </label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {['protanopia', 'deuteranopia', 'tritanopia'].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={simulationModes.includes(type)}
                  onChange={() => toggleSimulation(type)}
                />{' '}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {userColours.length >= 2 && (
        <div
          id="print-target"
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '2rem',
            borderRadius: '12px',
          }}
        >
          <ContrastChecker colours={combinedColours} backgroundColour={backgroundColour} />
          <StyleGuidePreview
            colours={combinedColours}
            suggestedGreen={suggestedGreen}
            suggestedRed={suggestedRed}
            backgroundColour={backgroundColour}
            simulationModes={simulationModes}
          />
          <ExportOptions colours={combinedColours} />
        </div>
      )}
    </div>
  );
}

export default ColourInputForm;
