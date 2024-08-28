import React, { useState, useEffect } from 'react'
import { fetchSongs } from './utils/api'
import { Navigation } from './components/Navigation'
import { SongList } from './components/SongList'
import { AudioPlayer } from './components/AudioPlayer'
import logo from "./assets/Logo.svg"
import { ArrowBack } from '@mui/icons-material'
import { ErrorDialog } from './components/ErrorDialog'

function App() {
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentTab, setCurrentTab] = useState('For You')
  const [showPlayer, setShowPlayer] = useState(false)
  const [error, setError] = useState(null)

    //Fetching songs through api endpoint
    useEffect(() => {
        const fetchedSongs = async() => {
            try {
                const data = await fetchSongs()
                setSongs(data)
            }
            catch(err) {
                setError(err.message)
            }
        }
        fetchedSongs()
    }, [])

    //For searching, and filtering songes
    const filteredSongs = songs.filter(song =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) || song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    )

    //Display filtered songs
    const displayedSongs = currentTab === 'Top Tracks'? filteredSongs.filter(song => song.top_track): filteredSongs

    //Play/ pause song
    const playPauseHandler = () => setIsPlaying(prevState => !prevState)

    //Find previous song and play it
    const previousHandler = () => {
        const currentIndex = displayedSongs.findIndex(song => song.id === currentSong.id)
        const prevIndex = (currentIndex - 1 + displayedSongs.length) % displayedSongs.length
        setCurrentSong(displayedSongs[prevIndex])
    }

    //Find next song and play it
    const nextHandler = () => {
        const currentIndex = displayedSongs.findIndex(song => song.id === currentSong.id)
        const nextIndex = (currentIndex + 1) % displayedSongs.length
        setCurrentSong(displayedSongs[nextIndex])
    }

    //Handle player based on size
    const handleSongSelect = (song) => {
        setCurrentSong(song)
        if(window.innerWidth < 1024) setShowPlayer(true)
    }

    //To handler move to library in small screens
    const backHandler = () => {
        setShowPlayer(false)
    }

    //Close error dialog
    const closeDialogHandler = () => {
        setError(null)
    }
    
    return (
        <div className="flex flex-col lg:flex-row bg-black h-screen text-white" style={{background: `linear-gradient(to bottom, ${currentSong?.accent || '#000000'}, #000000)`}}>
            {error && <ErrorDialog onClose={closeDialogHandler} errors={error}/>}
            <div className={`p-4 ${showPlayer? 'hidden': 'lg:w-1/5'}`}>
                <img src={logo} alt="Spotify" className="w-40 h-10 lg:w-52 lg:h-12" />
            </div>
            <div className={`flex-1 overflow-y-auto ${showPlayer? 'hidden': ''}`}>
                <Navigation currentTab={currentTab} onSearch={setSearchTerm} onSetTab={setCurrentTab}/>
                <SongList songs={displayedSongs} currentSong={currentSong} onSetSong={handleSongSelect}/>
            </div>
            <div className={`p-6 lg:w-1/3 sm:p-4 md:p-6 ${showPlayer? 'block': 'hidden'} lg:block`}>
                {showPlayer && window.innerWidth < 1024 && (
                    <div className="flex items-center mb-4">
                        <ArrowBack onClick={backHandler} fontSize="large" className="cursor-pointer mr-4" />
                        <h2 className="font-bold text-2xl">Now Playing</h2>
                    </div>
                )}
                <AudioPlayer currentSong={currentSong} isPlaying={isPlaying} onPlayPause={playPauseHandler} onNext={nextHandler} onPrevious={previousHandler}/>
           </div>
        </div>
    )
}

export default App