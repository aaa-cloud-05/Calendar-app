type ToggleRowProps = {
  label: string
  checked: boolean
  onToggle: (value: boolean) => void
}

const ToggleRow = ({ label, checked, onToggle }: ToggleRowProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={() => onToggle(!checked)}
        className={`w-10 h-6 rounded-full transition ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full transition translate-y-0.5 ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  )
}

export default ToggleRow