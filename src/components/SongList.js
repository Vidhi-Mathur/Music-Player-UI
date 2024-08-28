//Renders songlists received
export const SongList = ({ songs, currentSong, onSetSong}) => {
    return (
    <section className="mt-6 m-4">
        {songs.map(song => (
            <div key={song.id} className={`flex items-center p-2 rounded-md cursor-pointer ${currentSong?.id === song.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}  onClick={() => onSetSong(song)}>
                <img src={`https://cms.samespace.com/assets/${song.cover}`} alt={song.name} className="w-12 h-12 rounded-md mr-4" />
                <div className="flex-1">
                    <h3 className="font-semibold">{song.name}</h3>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
                <span className="text-sm text-gray-400">{song.duration || '3:30'}</span>
            </div>
        ))}
    </section>
    )
}

