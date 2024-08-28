//Navigation component containing tabs to switch
export const Navigation = ({currentTab, onSetTab, onSearch}) => {
    return (
        <header className="mt-8 ml-4 mb-6 mr-4">
            <nav className="flex space-x-4 sm:space-x-2 md:space-x-3 mb-6">
            <span className={`cursor-pointer text-lg ${currentTab === 'For You' ? 'text-white font-bold' : 'text-gray-400'}`}           onClick={() => onSetTab('For You')}>For You</span>        
            <span className={`cursor-pointer text-lg ${currentTab === 'Top Tracks' ? 'text-white font-bold' : 'text-gray-400'}`}  onClick={() => onSetTab('Top Tracks')}>Top Tracks</span>
            </nav>
            <div className="relative">
                <input type="text" placeholder="Search Song, Artist" onChange={(e) => onSearch(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none"/>
            </div>
        </header>
    )
}

