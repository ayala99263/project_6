import './SearchBar.css';

export default function SearchBar({ 
    searchTerm, 
    setSearchTerm, 
    searchBy, 
    setSearchBy, 
    options 
}) {
    return (
        <div className="search-bar-container">
            <label>Search by:</label>
            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                {options.map(opt => (
                    <option key={opt} value={opt}>
                        {opt.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </option>
                ))}
            </select>
            
            <input
                type="text"
                placeholder={`Search by ${searchBy}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm("")}>
                    Clear
                </button>
            )}
        </div>
    );
}