import React from 'react'
import {
    render,
    fireEvent,
    screen,
    act
} from '@testing-library/react'
import App from '../App'

test('routes to caronwer page', async () => {
    render(<App />)
    await act(async () => {
        fireEvent.click(screen.getByText('車 主'))
    })
    expect(window.location.pathname).toBe('/carowner');
})
