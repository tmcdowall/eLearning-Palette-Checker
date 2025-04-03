import html2pdf from 'html2pdf.js';

function ExportOptions({ colours }) {
  const exportPDF = () => {
    const element = document.getElementById('print-target');
    if (!element) return;

    const cloned = element.cloneNode(true);

    const title = document.createElement('h1');
    title.innerText = 'eLearnTint Colour Guide';
    title.style.fontSize = '24px';
    title.style.marginBottom = '0.5rem';
    title.style.borderBottom = '1px solid #000';

    const timestamp = document.createElement('p');
    timestamp.innerText = `Generated: ${new Date().toLocaleString()}`;
    timestamp.style.fontSize = '12px';
    timestamp.style.marginBottom = '1.5rem';
    timestamp.style.color = '#000';

    const footer = document.createElement('p');
    footer.innerText = 'Generated with eLearnTint';
    footer.style.fontSize = '10px';
    footer.style.marginTop = '2rem';
    footer.style.borderTop = '1px solid #000';
    footer.style.paddingTop = '0.5rem';
    footer.style.textAlign = 'center';
    footer.style.color = '#000';

    cloned.insertBefore(timestamp, cloned.firstChild);
    cloned.insertBefore(title, cloned.firstChild);
    cloned.appendChild(footer);

    const opt = {
      margin: 0.5,
      filename: `eLearnTint_Colour_Guide_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(cloned).save();
  };

  const copyToClipboard = () => {
    const palette = Object.entries(colours).map(([key, value]) => {
      const label = value.label || key;
      const hex = value.hex;
      const rgb = hexToRgb(hex);
      return `${label}: ${hex} | rgb(${rgb})`;
    });
    navigator.clipboard.writeText(palette.join('\n'));
    alert('Palette copied to clipboard!');
  };

  const downloadJSON = () => {
    const palette = Object.entries(colours).map(([key, value]) => ({
      name: value.label || key,
      hex: value.hex,
      rgb: hexToRgb(value.hex),
    }));
    const blob = new Blob([JSON.stringify(palette, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'eLearnTint_palette.json';
    link.click();
  };

  const hexToRgb = (hex) => {
    try {
      const [r, g, b] = hex
        .replace('#', '')
        .match(/.{1,2}/g)
        .map((c) => parseInt(c, 16));
      return `${r}, ${g}, ${b}`;
    } catch {
      return '0, 0, 0';
    }
  };

  return (
    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <button onClick={exportPDF} style={{ padding: '0.5rem 1rem' }}>
        Export as PDF
      </button>
      <button onClick={copyToClipboard} style={{ padding: '0.5rem 1rem' }}>
        Copy Palette to Clipboard
      </button>
      <button onClick={downloadJSON} style={{ padding: '0.5rem 1rem' }}>
        Download Palette as JSON
      </button>
    </div>
  );
}

export default ExportOptions;
