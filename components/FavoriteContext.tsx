import React, {createContext, useContext, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {toggleFavorite, updateFavorites} from '../redux/favoriteSlice';

interface FavoriteContextProps {
  favorites: string[];
  toggleFavorite: (videoId: number) => void;
}

const FavoriteContext = createContext<FavoriteContextProps | undefined>(undefined);

export const FavoriteProvider = ({children}) => {
  const cachedVideos = useSelector((state) => state.cachedVideos);
  const favorites = useSelector((state: any) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    const favoriteIds = cachedVideos.filter(video => video.favorite).map(video => video.id);
    dispatch(updateFavorites(favoriteIds));
  }, [cachedVideos, dispatch]);

  const toggleFavoriteHandler = (videoId: number) => {
    dispatch(toggleFavorite(videoId));
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite: toggleFavoriteHandler }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = (): FavoriteContextProps => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
