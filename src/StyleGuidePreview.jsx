import chroma from 'chroma-js';
import colorBlind from 'color-blind';

/**
 * Renders a comprehensive style guide preview for a given color palette, including accessibility contrast matrices, color swatches, button styles, and feedback indicators.
 *
 * The preview includes simulations for various types of color blindness, displays recommended text colors for accessibility, and evaluates color pairings against WCAG 2.2 contrast standards for both small and large text.
 *
 * @param {Object} props.colours - Mapping of color names to color data (hex and optional label).
 * @param {Object} props.suggestedGreen - Color object for "correct" feedback.
 * @param {Object} props.suggestedRed - Color object for "incorrect" feedback.
 * @param {string} props.backgroundColour - Hex string for the background color.
 * @param {string[]} [props.simulationModes] - Array of color blindness simulation mode names.
 *
 * @returns {JSX.Element} A React component displaying the style guide preview with accessibility and color blindness simulations.
 */
function StyleGuidePreview({
  colours,
  suggestedGreen,
  suggestedRed,
  backgroundColour,
  simulationModes = [],
}) {
  const getRGB = (hex) => chroma(hex).rgb().join(', ');

  const colourEntries = Object.entries(colours);
  const userColours = colourEntries.filter(([key]) => key !== 'black' && key !== 'white');

  const getTextColour = (bgHex) => {
    const contrastWithBlack = chroma.contrast('#000000', bgHex);
    const contrastWithWhite = chroma.contrast('#FFFFFF', bgHex);
    return contrastWithBlack > contrastWithWhite ? '#000000' : '#FFFFFF';
  };

  const getHoverColour = (hex, textColour) => {
    const darkened = chroma(hex).darken(1).hex();
    const lightened = chroma(hex).brighten(1).hex();
    return chroma.contrast(darkened, textColour) >= 4.5 ? darkened : lightened;
  };

  const sortedUserColours = userColours
    .map(([key, value]) => ({
      key,
      hex: value.hex,
      label: value.label || key,
      contrast: chroma.contrast(value.hex, backgroundColour),
    }))
    .sort((a, b) => b.contrast - a.contrast);

  const [primary, secondary] = sortedUserColours;

  const getRating = (ratio, size = 'small') => {
    if (size === 'large') {
      if (ratio >= 4.5) return 'AAA';
      if (ratio >= 3) return 'AA';
      return 'Fail';
    } else {
      if (ratio >= 7) return 'AAA';
      if (ratio >= 4.5) return 'AA';
      return 'Fail';
    }
  };

  const renderMatrix = (label, size) => (
    <>
      <h4>{label} Contrast Matrix</h4>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}></th>
            {colourEntries.map(([name]) => (
              <th key={`head-${label}-${name}`} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {colourEntries.map(([fgName, fgValue]) => (
            <tr key={`row-${label}-${fgName}`}>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{fgName}</th>
              {colourEntries.map(([bgName, bgValue]) => {
                const ratio = chroma.contrast(fgValue.hex, bgValue.hex);
                const rating = getRating(ratio, size);
                let bgColour = '#f8d7da';
                if (rating === 'AA') bgColour = '#fff3cd';
                if (rating === 'AAA') bgColour = '#d4edda';
                return (
                  <td
                    key={`cell-${label}-${fgName}-${bgName}`}
                    style={{
                      border: '1px solid #ccc',
                      padding: '0.5rem',
                      backgroundColor: bgColour,
                      textAlign: 'center',
                    }}
                  >
                    {rating}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderSwatches = (label, transformFn = (hex) => hex) => (
    <div style={{ flex: 1 }}>
      <h4>{label}</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        {colourEntries.map(([key, value]) => {
          const hex = transformFn(value.hex);
          return (
            <div
              key={key}
              style={{
                padding: '1rem',
                backgroundColor: hex,
                color: getTextColour(hex),
                borderRadius: '8px',
                minWidth: '140px',
                flex: '1 1 140px',
                textAlign: 'center',
              }}
            >
              <strong>{value.label || key}</strong>
              <div>{hex}</div>
              <div style={{ fontSize: '0.8rem' }}>rgb({getRGB(hex)})</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderButtons = (label, transformFn = (hex) => hex) => {
    const buttons = [primary, secondary];
    return (
      <div style={{ flex: 1 }}>
        <h4>{label}</h4>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {buttons.map((btn, index) => {
            if (!btn) return null;
            const bg = transformFn(btn.hex);
            const text = getTextColour(bg);
            const hover = getHoverColour(bg, text);
            return (
              <div key={index}>
                <button
                  style={{
                    backgroundColor: bg,
                    color: text,
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {index === 0 ? 'Primary Button' : 'Secondary Button'}
                </button>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {btn.label} | Text: {text} | Hover: {hover}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFeedback = (label, transformFn = (hex) => hex) => (
    <div style={{ flex: 1 }}>
      <h4>{label}</h4>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {[{ ...suggestedGreen, label: '✅ Correct' }, { ...suggestedRed, label: '❌ Incorrect' }].map(
          (item, i) => {
            const hex = transformFn(item.colour);
            return (
              <div
                key={i}
                style={{
                  backgroundColor: hex,
                  color: getTextColour(hex),
                  padding: '1rem',
                  borderRadius: '6px',
                  flex: '1',
                }}
              >
                {item.label}<br />
                Hex: {hex}<br />
                RGB: {getRGB(hex)}
              </div>
            );
          }
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h3>Style Guide Preview</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {renderSwatches('Normal Vision')}
          {simulationModes.map((mode) => renderSwatches(`Simulated: ${mode}`, colorBlind[mode]))}
        </div>

        {renderMatrix('Small Text', 'small')}
        {renderMatrix('Large Text', 'large')}

        <h4>Recommended Typography Contrast</h4>
        <p>
          Based on your default background colour ({backgroundColour}), we recommend using{' '}
          <strong>{getTextColour(backgroundColour)}</strong> for paragraph and heading text.
          This provides the best legibility and meets WCAG 2.2 contrast standards.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {renderButtons('Normal Vision')}
          {simulationModes.map((mode) => renderButtons(`Simulated: ${mode}`, colorBlind[mode]))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {renderFeedback('Normal Vision')}
          {simulationModes.map((mode) => renderFeedback(`Simulated: ${mode}`, colorBlind[mode]))}
        </div>
      </div>
    </div>
  );
}

export default StyleGuidePreview;
