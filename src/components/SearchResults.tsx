import { Song } from "@/types/song";

const SearchResults = ({ results, onSelect }: {
    results: Song[]
    onSelect: (song: Song) => void
}) => {
    return (
        <>
            {results.map((item, i) => (
                <div
                    onClick={() => onSelect(item)}
                    className="cursor-pointer hover:bg-blue-500 bg-white rounded-xl shadow-lg text-center md:text-left p-3 my-2"
                    key={i}>
                    <p>
                        {item.name} by {item.artist}
                    </p>
                </div>
            ))}
        </>
    );
}

export default SearchResults;