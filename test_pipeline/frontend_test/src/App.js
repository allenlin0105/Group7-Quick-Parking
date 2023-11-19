import logo from './logo.svg';
import './App.css';
import axios from "axios";

async function click() {
  try {
    const Data = await axios.get("/api/test");
    const data = Data.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={click}>
          See console
        </button>
      </header>
      
    </div>
  );
}

export default App;
