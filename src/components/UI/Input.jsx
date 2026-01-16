export const Input = ({ id, label, type = 'text', value, onChange, placeholder, className = '', ...props }) => (
    <div className={`input-group ${className}`}>
        {label && <label htmlFor={id} className="input-label">{label}</label>}
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="input-field"
            {...props}
        />
    </div>
)

export const Checkbox = ({ label, checked, onChange, className = '', children }) => (
    <label className={`checkbox-label ${className}`}>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="checkbox-input"
        />
        {label && <span className="checkbox-text">{label}</span>}
        {children}
    </label>
)
