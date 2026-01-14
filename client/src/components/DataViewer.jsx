export default function DataViewer({ loading, error, data, children }) {
    if (error) return <h2>Error: {error.message} ⚠️</h2>;

    if (loading && (!data || data.length === 0)) {
        return <h2>Loading... ⏳</h2>;
    }

    return (
        <div>
            {loading && (
                <div>
                    Updating... ⏳
                </div>
            )}

            {children}

            {!loading && data && data.length === 0 && (
                <p>No results found.</p>
            )}
        </div>
    );
};
 