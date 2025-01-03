const CheckBox = ({ label, onChange, name, labelClasses, isChecked }) => {
  return (
    <label className="flex cursor-pointer items-center text-xl text-white">
      <span
        className={`mr-4 flex h-5 w-5 items-center justify-center ${
          isChecked ? 'gradient-1' : 'border-gray-300 border bg-white'
        } rounded-sm`}
      >
        <span
          className={`inline-block h-4 w-4 ${
            isChecked ? 'gradient-1' : 'bg-black'
          } rounded-sm`}
        ></span>
      </span>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => {
          onChange(e);
        }}
        name={name}
        className="hidden"
      />
      <span className={labelClasses}>{label}</span>
    </label>
  );
};

export default CheckBox;
