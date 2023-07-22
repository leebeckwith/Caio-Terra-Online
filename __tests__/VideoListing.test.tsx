import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import VideoListing from '../VideoListingScreen';

const mockData = [
  {
    id: '1',
    title: 'Video 1',
    thumbnail: 'https://example.com/thumbnail1.jpg',
  },
  {
    id: '2',
    title: 'Video 2',
    thumbnail: 'https://example.com/thumbnail2.jpg',
  },
];

describe('VideoListing', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test('renders video listing correctly', async () => {
    const {findAllByTestId} = render(<VideoListing />);
    const thumbnails = await findAllByTestId('thumbnail');
    expect(thumbnails.length).toBe(2); // Assuming there are 2 videos in the mockData
  });

  test('handles API error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      }),
    );

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const {queryByTestId} = render(<VideoListing />);
    await waitFor(() => {
      const errorMessage = queryByTestId('error-message');
      expect(errorMessage).toBeTruthy();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching video listing:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
