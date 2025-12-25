
const Input = ({ type, placeholder, value, onChange, icon, suffix, error }) => {
  return (
    <div className="input-wrapper">
      <div className={`input-field-container ${error ? "border-error" : ""}`}>
        {icon && <span className="input-icon-left">{icon}</span>}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="custom-input"
        />

        {suffix && <span className="input-icon-right">{suffix}</span>}
      </div>
    </div>
  );
};

export default Input;