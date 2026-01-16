import { Input } from './UI/Input'

export const PaxForm = ({ diners, numDiners, setNumDiners, updateDinerName }) => {
    return (
        <>
            <Input
                id="num-diners"
                label="Number of people"
                type="number"
                min="1"
                max="20"
                value={numDiners}
                onChange={(e) => setNumDiners(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            />

            <div className="diners-list">
                {diners.map((diner, index) => (
                    <div key={diner.id} className="diner-input-group">
                        <label className="diner-label">Person {index + 1}</label>
                        <input
                            type="text"
                            value={diner.name}
                            onChange={(e) => updateDinerName(diner.id, e.target.value)}
                            placeholder={`e.g., Sarah`}
                            className="input-field"
                        />
                        {!diner.name && (
                            <span className="input-hint">Tip: Add a name for easier tracking</span>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}
