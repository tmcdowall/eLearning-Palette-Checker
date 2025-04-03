import './App.css';
import ColourInputForm from './ColourInputForm';

function App() {
  return (
    <div>
      <header className="topbar">
        <div className="topbar-content">
          <div className="logo-container">
            <img src="/logo.png" alt="eLearning Palette Builder Logo" className="logo" />
          </div>
          <div className="nav-buttons">
            <a href="https://www.youtube.com/@InstructionalDesignTips" target="_blank" rel="noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                alt="YouTube"
                className="icon-button youtube-light"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/32/YouTube_social_dark_squircle_(2017).svg"
                alt="YouTube (Dark)"
                className="icon-button youtube-dark"
              />
            </a>
            <a href="https://patreon.com/IDT" target="_blank" rel="noreferrer">
              <img
                src="https://c5.patreon.com/external/logo/become_a_patron_button.png"
                alt="Patreon"
                className="patreon-button"
              />
            </a>
            <a href="https://buymeacoffee.com/idtips" target="_blank" rel="noreferrer">
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me a Coffee"
                className="bmc-button"
              />
            </a>
          </div>
        </div>
      </header>

      <main className="main-content">
        <h1>eLearning Palette Builder</h1>
        <p className="intro">
          This tool takes your intended colour palette and identifies how you should translate it to
          common UI components like buttons to ensure accessibility in line with WCAG 2.2 colour contrast.
        </p>
        <ColourInputForm />
      </main>
    </div>
  );
}

export default App;
