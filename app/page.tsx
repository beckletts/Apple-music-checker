'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Define interface for track data
interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  trackViewUrl: string;
  artworkUrl100?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchAppleMusic = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?term=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching Apple Music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAppleMusic(searchQuery);
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Apple Music Track Checker
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a track name..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {searchResults.map((track: Track) => (
            <div
              key={track.trackId}
              className="p-4 bg-gray-700 rounded-lg flex items-center gap-4"
            >
              {track.artworkUrl100 && (
                <div className="relative w-16 h-16">
                  <Image
                    src={track.artworkUrl100}
                    alt={track.trackName}
                    fill
                    sizes="64px"
                    style={{objectFit: 'cover'}}
                    className="rounded-md"
                  />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-white">{track.trackName}</h2>
                <p className="text-gray-300">{track.artistName}</p>
                <p className="text-gray-400">{track.collectionName}</p>
                <a
                  href={track.trackViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  View on Apple Music
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
