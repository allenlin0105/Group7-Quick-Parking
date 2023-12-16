import React from 'react'
import {
    rest
} from 'msw'
import {
    setupServer
} from 'msw/node'
import {
    render,
    fireEvent,
    screen
} from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from "../src/pages/Home"

test('routes to caronwer page', async () => {
    render(<Home />)
    fireEvent.click(screen.getByText('車主'))
    expect(window.location.pathname).toBe('/carowner');
})

test('routes to guard page', async () => {
    render(<Home />)
    fireEvent.click(screen.getByText('警衛'))
    expect(window.location.pathname).toBe('/guard');
})