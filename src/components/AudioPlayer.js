import React, { useEffect, useRef, useState } from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

export const AudioPlayer = ({ currentSong, isPlaying, onPlayPause, onNext, onPrevious }) => {
  //Refs to access and control audio and interval
  const audioRef = useRef(null)
  const intervalRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  //To play/ pause 
  useEffect(() => {
    if(currentSong){
      if(isPlaying){
        audioRef.current?.play()
        startTimer()
      } 
      else {
        audioRef.current?.pause()
        clearInterval(intervalRef.current)
      }
    }
  }, [currentSong, isPlaying])

  //Updating progress based on current time
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      if(audioRef.current && audioRef.current.currentTime && audioRef.current.duration) {
        setCurrentTime(audioRef.current.currentTime)
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
      }
    }, 1000)
  }

  //Handle progress bar change to seek through the audio
    const handleProgressChange = (e) => {
        const newProgress = parseFloat(e.target.value)
        if(isNaN(newProgress) || newProgress < 0 || newProgress > 100) return
        const newTime = (newProgress / 100) * duration
        if(!isNaN(newTime) && newTime >= 0 && audioRef.current) {
          audioRef.current.currentTime = newTime
          setProgress(newProgress)
          setCurrentTime(newTime)
        }
    }

  //Set audio duration and initial progress when metadata is loaded
  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration)
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
      }
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [currentSong])

  //Don't render player if no song played
  if(!currentSong) return null

  return (
    <div className="flex flex-col h-full sm:px-4 md:px-6">
      {currentSong && (
        <>
           <div className='mt-7 sm:ml-2 md:ml-10'>
           <h2 className='font-bold text-2xl'>{currentSong.name}</h2>
           <p>{currentSong.artist}</p>
           </div>
          <img src={`https://cms.samespace.com/assets/${currentSong.cover}`} alt={currentSong.name} className="mt-4 w-full aspect-square object-cover max-w-96 rounded-md mb-6 ml-10 sm:max-w-full md:max-w-80" />
          <div >
            <input type="range" min="0" max="100" value={progress} onChange={handleProgressChange} className="w-full bg-gray-700 rounded-full h-1 mb-6"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
                <MoreHorizIcon fontSize='large' className='cursor-pointer'/>
            <div className="flex items-center space-x-4">
                <SkipPreviousIcon fontSize='large' onClick={onPrevious} className='cursor-pointer'/>
                {isPlaying ? <PauseCircleIcon fontSize="large" onClick={onPlayPause} className='cursor-pointer'/>: <PlayCircleIcon fontSize='large' onClick={onPlayPause} className='cursor-pointer'/>}
                <SkipNextIcon fontSize='large' onClick={onNext} className='cursor-pointer'/>
            </div>
            <VolumeUpIcon fontSize='large' className='cursor-pointer' />
          </div>
          <audio ref={audioRef} src={currentSong.url} onEnded={() => {   
                onPlayPause(false)
                onNext()
            }}
            preload="auto"/>
        </>
      )}
    </div>
  )
}
