import React from 'react';
import { render, act } from '@testing-library/react';
import Plan from '../components/Plan';
import { createCanvas } from 'canvas';

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// // Mock the service to provide controlled data
// jest.mock('../services/service', () => ({
//     getAvailableSpace: jest.fn().mockResolvedValue({
//         data: { space_list: [1, 3] } // Assuming spaces 1 and 3 are available (not occupied)
//     }),
// }));

// Mock the Plan.json data and getAvailableSpace function
jest.mock('../components/Plan.json', () => ([
    {
      "id": 1,
      "x": 196,
      "y": 66,
      "w": 50,
      "h": 110,
      "r": 0,
      "occupied": false
    },
    {
      "id": 2,
      "x": 256,
      "y": 66,
      "w": 50,
      "h": 110,
      "r": 0,
      "occupied": false
    },
    {
      "id": 3,
      "x": 316,
      "y": 66,
      "w": 50,
      "h": 110,
      "r": 0,
      "occupied": false
    },
    {
      "id": 4,
      "x": 376,
      "y": 66,
      "w": 50,
      "h": 110,
      "r": 0,
      "occupied": false
    },
    {
      "id": 5,
      "x": 436,
      "y": 66,
      "w": 50,
      "h": 110,
      "r": 0,
      "occupied": false
    }]));

// Mock global Image class to simulate image loading
global.Image = class {
    constructor() {
        setTimeout(() => this.onload(), 10); // Simulate async image loading
    }
    onload() {}
    src = '';
};

it('shows car images on occupied spaces', async () => {
    // Define ctx in a broader scope
    let ctx;

    // Set up a mock canvas environment
    HTMLCanvasElement.prototype.getContext = () => {
        const canvas = createCanvas(2000, 2000);
        ctx = canvas.getContext('2d');
        ctx.drawImage = jest.fn(); // Mocking drawImage
        return ctx;
    };

    // Mock getBoundingClientRect
    HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
        x: 0, y: 0, width: 2000, height: 2000, top: 0, right: 2000, bottom: 2000, left: 0
    });

    await act(async () => {
        render(<Plan />);
    });

    // Waiting for the asynchronous operations in the component to complete
    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the timeout as necessary
    });

    // Verify that drawImage was called for occupied spaces
    expect(ctx.drawImage).toHaveBeenCalled();
    expect(ctx.drawImage.mock.calls.length).toBe(4);  // On load + # of occupied spaces  
});
