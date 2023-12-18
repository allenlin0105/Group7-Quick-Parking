import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Plan from '../components/Plan';
import { createCanvas } from 'canvas';

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

it('routes to /guard/history when a space is clicked', async () => {
  // Set up a mock canvas environment
  HTMLCanvasElement.prototype.getContext = () => {
    const canvas = createCanvas(2000, 2000);
    const ctx = canvas.getContext('2d');
    ctx.drawImage = jest.fn(); // Mocking drawImage
    return ctx;
  };

  // Mock getBoundingClientRect
  HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
    x: 0, y: 0, width: 2000, height: 2000, top: 0, right: 2000, bottom: 2000, left: 0
  });

  // Render the component
  await act(async () => {
    render(<Plan guard={true} />)
  });

  // Simulate a click event on the canvas at the coordinates of the first space
  const canvas = document.querySelector('canvas');
  await act(async () => {
    fireEvent.click(canvas, { clientX: 196, clientY: 66 }); // Adjust coordinates as needed
  });

  // Check if navigate was called with the correct route
  expect(mockNavigate).toHaveBeenCalledWith('/guard/history', expect.anything());
  // expect(window.location.pathname).toBe('/guard/history');
});

it('not route to /guard/history when a space is unclickable', async () => {
    // Set up a mock canvas environment
    HTMLCanvasElement.prototype.getContext = () => {
      const canvas = createCanvas(2000, 2000);
      const ctx = canvas.getContext('2d');
      ctx.drawImage = jest.fn(); // Mocking drawImage
      return ctx;
    };
  
    // Mock getBoundingClientRect
    HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
      x: 0, y: 0, width: 2000, height: 2000, top: 0, right: 2000, bottom: 2000, left: 0
    });
  
    // Render the component
    await act(async () => {
      render(<Plan guard={false} />);
    });
  
    // Simulate a click event on the canvas at the coordinates of the first space
    const canvas = document.querySelector('canvas');
    await act(async () => {
      fireEvent.click(canvas, { clientX: 196, clientY: 66 }); // Adjust coordinates as needed
    });
  
    // Check if navigate was called with the correct route
    expect(mockNavigate).not.toHaveBeenCalledWith('/guard/history', expect.anything());
    // expect(window.location.pathname).not.toBe('/guard/history');
  });