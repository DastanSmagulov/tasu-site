"use client";
export interface CheckboxProps {
  disabled?: boolean;
  defaultChecked?: boolean;
  id?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = (props: CheckboxProps) => (
  <div className="flex gap-2">
    <input
      type="checkbox"
      className="checkbox border-gray-400 [--chkbg:theme(colors.customYellow)] checkbox-sm checked:border-none"
    />
  </div>
);

export default Checkbox;
