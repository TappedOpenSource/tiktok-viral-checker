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
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="App">
        <h1 className="text-5xl font-extrabold text-center">Tiktok Viral Checker ✅</h1>
        <h3 className="text-2xl text-center">See if your song is viral on Tiktok</h3>
        <div className="h-8"></div>
        <form className="" onSubmit={onFormSubmit}>
          <div className="relative flex h-10 w-full min-w-[200px] max-w-[32rem]">
            <input
              type="text"
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=""
              onChange={(e) => setTerm(e.target.value)}
            />
            <button
              className="!absolute right-1 top-1 z-10 select-none rounded bg-pink-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
              type="button"
              data-ripple-light="true"
            >
              Submit
            </button>
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Track Name
            </label>
          </div>
          {hasSearched ? (
            <p>
              Showing results for <em>{displayTerm}</em>
            </p>
          ) : null}
        </form>
        <div className="content">
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
  )
}
