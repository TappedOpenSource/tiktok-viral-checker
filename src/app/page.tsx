'use client';

import Nav from "@/components/Nav";
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
    if (term.trim() === "") return;

    //console.log(this.state.term);
    setHasSearched(true);
    setHasSubmitted(true);
    setSearchResults([]);

    const res = await fetch(`/search`, {
      body: JSON.stringify({ term }),
      method: "POST",
    });
    const { results }: {
      results: Song[],
    } = await res.json();

    console.log({ results });
    try {
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
        console.log({ isViral })
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
        const { is_viral: isViral } = await response.json();
        console.log({ isViral })
        setIsViral(isViral);
        setSong(item);
        setSearchResults([]);
      } catch (err) {
        console.log(err);
      }
      // unique song (no duplicates) - send ONE ID backend
    }
  };

  return (
    <div className="">
      <Nav />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="px-6">
          <h1 className="text-5xl font-extrabold text-center">Tiktok Viral Checker ✅</h1>
          <h3 className="text-2xl text-center">See if your song is viral on Tiktok</h3>
          <div className="h-8"></div>
          <form className="" onSubmit={onFormSubmit}>
            <div className="flex flex-col justify-center w-full min-w-[200px] max-w-[32rem]">
              <input
                type="text"
                // className="peer h-full w-full rounded-[7px] border border-blue-gray-200 px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                className="p-4 rounded-xl"
                placeholder="track name"
                onChange={(e) => setTerm(e.target.value)}
              />
              <div className="h-4"></div>
              <button
                // className="!absolute right-1 top-1 z-10 select-none rounded bg-pink-500 py-2 px-4 text-center align-middle text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
                className="bg-blue-500 font-bold rounded-xl p-4 mb-4"
                type="submit"
                data-ripple-light="true"
              >
                Submit
              </button>
            </div>
            {hasSearched ? (
              <p className="font-bold text-lg px-4">
                Showing results for <em>{displayTerm}</em>
              </p>
            ) : null}
          </form>
          <div className="flex flex-col px-4">
            {isViral !== null ? (
              <div className="w-75">
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
    </div>
  )
}
