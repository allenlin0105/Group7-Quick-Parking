import React from 'react'
import {Link} from 'react-router-dom'

export default function Home() {
    // todo: a pop up login here.
    return (
      <div className='center'>
        <h1>Quick Parking</h1>
        <h2>你的身份是...</h2>
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