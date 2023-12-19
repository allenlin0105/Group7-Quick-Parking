import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import Home from '../pages/carowner/Home.js';

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

it('shows correct numbers of available space and total space', async () => {
  // Render the component
  await act(async () => {
    render(<Home />)
  });

  // Simulate a click event on the canvas at the coordinates of the first space
  const availableSpaceNum = screen.getByTestId("availSpace")
  const totalSpaceNum = screen.getByTestId('totalSpace')
  expect(availableSpaceNum).toHaveTextContent('2');
  expect(totalSpaceNum).toHaveTextContent('5');
});
