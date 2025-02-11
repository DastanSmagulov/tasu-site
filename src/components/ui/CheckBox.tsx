export interface CheckboxProps {
  disabled?: boolean;
  defaultChecked?: boolean;
  id?: string;
  checked?: boolean | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ checked, onChange, id, disabled }: CheckboxProps) => (
  <div className="flex gap-2">
    <input
      type="checkbox"
      id={id}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      className="checkbox border-gray-400 [--chkbg:theme(colors.customYellow)] checkbox-sm checked:border-none"
    />
  </div>
);

export default Checkbox;
