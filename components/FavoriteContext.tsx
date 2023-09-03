import React, {createContext, useContext, useState, useEffect} from 'react';
import {getCachedVideos} from '../storage';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const initializeFavorites = async () => {
      try {
        const cachedVideos = await getCachedVideos();
        const favoriteIds = cachedVideos.filter(video => video.favorite).map(video => video.id);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error initializing favorites:', error);
      }
    };

    initializeFavorites();
    //console.log(favorites);
  }, []);

  // Add a function to toggle the favorite state
  const toggleFavorite = (videoId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(videoId)) {
        return prevFavorites.filter((id) => id !== videoId);
      } else {
        return [...prevFavorites, videoId];
      }
    });
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
