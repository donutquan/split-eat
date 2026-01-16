export const Section = ({ title, icon, isExpanded, onToggle, children }) => (
    <section className="glass-card">
        <button className="section-header" onClick={onToggle}>
            <h2 className="section-title">{icon} {title}</h2>
            <span className={`section-chevron ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </button>
        {isExpanded && (
            <div className="section-content">
                {children}
            </div>
        )}
    </section>
)
