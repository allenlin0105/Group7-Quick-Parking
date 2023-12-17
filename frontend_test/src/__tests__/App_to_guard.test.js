import React from 'react'
import {
    render,
    screen,
    fireEvent,
    act
} from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import App from '../App'

import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;

test('routes to guard page', async () => {
    render(<App />)
    
    await act(async () => {
        fireEvent.click(screen.getByText('警 衛'))// Check if the dialog is now visible
    });

    const dialog = screen.getByText("登入系統"); // Adjust this to match how you identify the dialog
    expect(dialog).toBeInTheDocument();
    
    await act(async () => {
        // const username = screen.getByTestId('usernameInput')
        // await userEvent.type(username, 'group7')
        // const passwd = screen.getByTestId("passwordInput")
        // await userEvent.type(passwd, '1234')
        
        fireEvent.click(screen.getByText('登入'));
    });

    const goToMangeButton = screen.getByText('管理系統')
    expect(goToMangeButton).toBeInTheDocument();
    await act(async () => {
        fireEvent.click(goToMangeButton);
    })
    expect(window.location.pathname).toBe('/guard');
})