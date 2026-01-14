import './DataViewer.css';

export default function DataViewer({ loading, error, data, children }) {
    if (error) {
        return (
            <div className="data-viewer-error">
                <span className="error-icon">⚠️</span>
                <div className="error-content">
                    <h3 className="error-title">Error</h3>
                    <p className="error-message">{error.message}</p>
                </div>
            </div>
        );
    }

    if (loading && (!data || data.length === 0)) {
        return (
            <div className="data-viewer-loading">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        );
    }

    return (
        <div className="data-viewer-container">
            {loading && (
                <div className="data-viewer-updating">
                    <div className="spinner-small"></div>
                    <span className="updating-text">Updating...</span>
                </div>
            )}

            {children}

            {!loading && data && data.length === 0 && (
                <div className="data-viewer-empty">
                    <div className="empty-icon">📭</div>
                    <p className="empty-text">No results found</p>
                </div>
            )}
        </div>
    );
};