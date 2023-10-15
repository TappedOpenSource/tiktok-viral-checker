import { Song } from "@/types/song";

const SearchResults = ({ results, onSelect }: {
    results: Song[]
    onSelect: (song: Song) => void
}) => {
    return (
        <>
            {results.map((item, i) => (
                <button
                    onClick={() => onSelect(item)}
                    className="btn btn-light rounded w-50 mx-auto d-block mb-2"
                    key={i}>
                    {item.name} by {item.artist}
                </button>
            ))}
        </>
    );
}

export default SearchResults;