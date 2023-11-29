import React from 'react'
import {Link} from 'react-router-dom'

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

export default function Home() {
    // todo: a pop up login here.
    return (
      <div className='center'>
        <h1>Quick Parking</h1>
        <h2>你的身份是...</h2>
        <div>
          <button onClick={click}>
            See console
          </button>
        </div>
        <nav>
          <div>
          <Link to="/carowner">
            <button type="button">
            車主
            </button>
          </Link>
          </div>
          <div>
          <Link to="/guard">
            <button type="button">
              警衛
            </button>
          </Link>
          </div>
        </nav>
      </div>
    );
};
