export const fetchSongs = async () => {
    const response = await fetch('https://cms.samespace.com/items/songs')
    if (!response.ok) {
      throw new Error('Failed to fetch songs')
    }
    const data = await response.json()
    return data.data
  }