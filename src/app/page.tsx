'use client';

import SearchResults from "@/components/SearchResults";
import { Song } from "@/types/song";
import { obtainDuplicates, removeDuplicates } from "@/utils/utils";
import { EventHandler, FormEventHandler, useState } from "react";

export default function Home() {
  const [term, setTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isViral, setIsViral] = useState<boolean | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const [displayTerm, setDisplayTerm] = useState("");

  const onFormSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    //console.log(this.state.term);
    setHasSearched(true);
    setHasSubmitted(true);
    setSearchResults([]);

    const res = await fetch(`/search`, {
      body: JSON.stringify({ term }),
      method: "POST",
    });
    const { results, viral }: {
      results: Song[],
      viral: boolean | undefined
    } = await res.json();

    console.log({ results });
    try {
      setIsViral(viral ?? null);
      setSearchResults(results ?? []);
      setDisplayTerm(term);

      const uniqueSongs = removeDuplicates(results ?? []);
      setSearchResults(uniqueSongs);
    } catch (error) {
      console.log(error);
    }

  };

  const onSongSelect = async (item: Song) => {
    // this will determine if the song is viral or not (return TRUE or FALSE)
    console.log(item);
    const searchTerm = obtainDuplicates(searchResults, item);
    console.log({ searchTerm });
    if (searchTerm.length > 1) {
      // duplicates exist - send all IDs to backend
      const term = encodeURIComponent(JSON.stringify(searchTerm));
      //console.log(term);
      try {
        const response = await fetch(`/isviral`, {
          method: "POST",
          body: JSON.stringify({ term }),
        });

        const { is_viral: isViral } = await response.json();
        setIsViral(isViral);
        setSong(item);
        setSearchResults([]);
      } catch (err) {
        console.log(err);
      }
      
    } else {
      try {
        const response = await fetch(`/isviral`, {
          method: "POST",
          body: JSON.stringify({ id: item.id }),
        });
        const output = await response.json();
        setIsViral(output);
        setSong(item);
        setSearchResults([]);
      } catch (err) {
        console.log(err);
      }
      // unique song (no duplicates) - send ONE ID backend
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="App">
        <nav className="mx-auto">
          <div className="navbar justify-content-center">
            {/* <h1 className="">Tiktok Viral Checker ✅</h1> */}
            <h1 className="">Tiktok Viral Checker ✅</h1>
          </div>
        </nav>
        <div className="">
          <div className="">
            <h3>See if your song is viral on Tiktok</h3>
            <em className="mb-5">You might have to press submit 2-3 times (sorry)</em>
            <form className="" onSubmit={onFormSubmit}>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm mx-2 mb-1">Submit</button>
              {hasSearched ? (
                <p>
                  Showing results for <em>{displayTerm}</em>
                </p>
              ) : (
                <div></div>
              )}
            </form>
          </div>
        </div>
        <div className="content">
          {isViral !== null ? (
            <div className="w-75 mx-auto">
              <h2>Is &quot;{song?.name}&quot; by {song?.artist} viral?</h2>
              <h2>{isViral ? "Yes ✅" : "No ❌"}</h2>
            </div>
          ) : (
            <div></div>
          )}
          <div>
            {searchResults.length === 0
              ? null
              : <SearchResults results={searchResults} onSelect={onSongSelect} />}
          </div>
        </div>
      </div>
    </main>
  )
}
