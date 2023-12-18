import React from 'react'
import {
    render,
    screen,
    fireEvent,
    act
} from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import App from '../App'
import { server } from "../mocks/server"
import { rest } from "msw";

import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

test('login failed', async () => {
    
    server.use(
        rest.post(`${baseURL}/login`, async (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    status: 400,
                    message: "Failed"
                })
            );
          }),
      );
    
    render(<App />)
    
    act(() => {
        fireEvent.click(screen.getByText('警 衛'))// Check if the dialog is now visible
    });

    const dialog = screen.getByText("登入系統"); // Adjust this to match how you identify the dialog
    expect(dialog).toBeInTheDocument();
    
    await act(async () => {
        // const username = screen.getByTestId('usernameInput')
        // await userEvent.type(username, 'group1')
        // const passwd = screen.getByTestId("passwordInput")
        // await userEvent.type(passwd, '4321')
        
        fireEvent.click(screen.getByText('登入'));
    });

    expect(window.location.pathname).toBe('/');
    const errorMsg = screen.getByTestId("loginFailedMsg")
    expect(errorMsg).toHaveTextContent('登入失敗');
})