import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
   title: string;
   members: string;
   thumbnail: string;
   duration: number;
   url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling:boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState: (active: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
};

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
  
    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = (isShuffling || (currentEpisodeIndex + 1) < episodeList.length);

    function play(episode) {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
    }
  
    function togglePlay() {
      setIsPlaying(!isPlaying);
    }
  
    function setPlayingState(active: boolean) {
      setIsPlaying(active);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider 
        value={{ 
            episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            play, 
            togglePlay, 
            setPlayingState,
            playList,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            isLooping,
            toggleLoop,
            isShuffling,
            toggleShuffle,
            clearPlayerState
            }}
        >
            { children }
        </PlayerContext.Provider>
    )
}

// Para usar o contexto como um hook
export const usePlayer = () => {
    return useContext(PlayerContext);
}