import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import Home from '../pages/carowner/Home.js';
import { server } from "../mocks/server"
import { rest } from "msw";

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

it('routes to /carowner/search/ when car is found', async () => {
  // Render the component
  await act(async () => {
    render(<Home />)
  });

  // Simulate a click event on the canvas at the coordinates of the first space
  const searchButton = screen.getByRole('button')
  await act(async () => {
    fireEvent.click(searchButton); // Adjust coordinates as needed
  });

  // Check if navigate was called with the correct route
  expect(mockNavigate).toHaveBeenCalledWith('/carowner/search/', expect.anything());
  // expect(window.location.pathname).toBe('/guard/history');
});

it('routes to /carowner/not_found/ when car not found', async () => {

  server.use(
    rest.post(`${baseURL}/find_car`, async (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
              message: "not found",
              space_id: -1
            })
        );
      }),
  );

  // Render the component
  await act(async () => {
    render(<Home />)
  });

  // Simulate a click event on the canvas at the coordinates of the first space
  const searchButton = screen.getByRole('button')
  await act(async () => {
    fireEvent.click(searchButton); // Adjust coordinates as needed
  });

  // Check if navigate was called with the correct route
  expect(mockNavigate).toHaveBeenCalledWith('/carowner/not_found/', expect.anything());
  // expect(window.location.pathname).toBe('/guard/history');
});


