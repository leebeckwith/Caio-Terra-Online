import 'react-native';
import {Alert} from 'react-native';
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import App from '../App';

describe('Login Page', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test('renders the login form', () => {
    const {getByPlaceholderText, getByText} = render(<App />);

    // Verify the presence of the username and password input fields
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();

    // Verify the presence of the login button
    const loginButton = getByText('Login');
    expect(loginButton).toBeTruthy();
  });

  test('logs in successfully with valid credentials', async () => {
    // Mock Response Data
    const mockResponseData = {
      result: true,
      message: 'Login Successful, redirecting...',
    };

    // Mock the API response
    const mockResponse = new Response(JSON.stringify(mockResponseData), {
      status: 200,
      headers: new Headers(),
      statusText: 'OK',
    });

    jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(Promise.resolve(mockResponse));

    const {getByPlaceholderText, getByText} = render(<App />);

    // Fill in the username and password fields
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpassword');

    // Simulate a button press
    fireEvent.press(loginButton);

    // Mock the Alert.alert function
    const alertMock = jest.spyOn(Alert, 'alert');

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://caioterra.com/wp-admin/admin-ajax.php',
        {
          method: 'POST',
          body: expect.any(FormData),
        },
      );
    });

    // Verify that the login was successful
    // For example, you can assert that the app behaves correctly after successful login
    expect(alertMock).toHaveBeenCalledWith('Login Successful', 'Welcome!');
  });

  test('displays error message with missing credentials', async () => {
    const {getByPlaceholderText, getByText} = render(<App />);
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(usernameInput, ''); // Set a blank username
    fireEvent.changeText(passwordInput, ''); // Set a blank password

    fireEvent.press(loginButton); // Trigger login with blank username

    expect(Alert.alert).toHaveBeenCalledWith(
      'Invalid Login',
      'Please enter a username and password.',
    );
  });

  test('displays error message with invalid credentials', async () => {
    // Mock Response Data
    const mockResponseData = {
      result: false,
      error:
        '<strong>Error:<\\/strong> The username is not registered on this site. If you are unsure of your username, try your email address instead.',
    };

    // Mock the API response
    const mockResponse = new Response(JSON.stringify(mockResponseData), {
      status: 200,
      headers: new Headers(),
      statusText: 'OK',
    });

    jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(Promise.resolve(mockResponse));

    const {getByPlaceholderText, getByText} = render(<App />);

    // Fill in the username and password fields
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpassword');

    // Simulate a button press
    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    // Mock the Alert.alert function
    const alertMock = jest.spyOn(Alert, 'alert');

    // Wait for the API call to resolve
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://caioterra.com/wp-admin/admin-ajax.php',
        {
          method: 'POST',
          body: expect.any(FormData),
        },
      );
    });

    // Verify that the login was successful
    // For example, you can assert that the app behaves correctly after successful login
    expect(alertMock).toHaveBeenCalledWith(
      'Error',
      '<strong>Error:<\\/strong> The username is not registered on this site. If you are unsure of your username, try your email address instead.',
    );
  });

  test('displays error message when there is an error during login', async () => {
    // Mock the fetch function to simulate an error
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    // Mock the Alert.alert function
    const alertMock = jest.spyOn(Alert, 'alert');

    const {getByPlaceholderText, getByText} = render(<App />);

    // Fill in the username and password fields
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpassword');

    // Simulate a button press
    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    // Wait for the error handling in the try/catch block to execute
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        'Error',
        'There was an error logging in.',
      );
    });

    // Verify that the fetch function was called with the correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      'https://caioterra.com/wp-admin/admin-ajax.php',
      {
        method: 'POST',
        body: expect.any(FormData),
      },
    );
  });
});
