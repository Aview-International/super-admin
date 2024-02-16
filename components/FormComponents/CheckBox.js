import Image from 'next/image';
import Tooltip from '../../public/img/icons/tooltip.svg';
import Info from '../../public/img/icons/info.svg';
import Border from '../UI/Border';

const CheckBox = ({ label, onChange, tooltip, name, labelClasses, isChecked, type }) => {

  return (
    <label className="flex cursor-pointer items-center text-xl text-white">
      <span
        className={`mr-4 flex h-5 w-5 items-center justify-center ${isChecked ? 'gradient-1' : 'bg-white border border-gray-300'} rounded-sm`}
      >
        <span
          className={`inline-block h-4 w-4 ${isChecked ? 'gradient-1' : 'bg-black'} rounded-sm`}
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
      {tooltip && (
        <div className="group relative mx-s2 mt-s1 p-2">
          <Image src={Info} alt="info" />
          <span className="invisible absolute left-[10px] top-[30px] z-10 h-5 w-5 rotate-90 group-hover:visible md:top-[10px] md:left-[30px] md:rotate-0">
            <Image src={Tooltip} alt="Tooltip" width={50} height={50} />
          </span>
          <Border
            borderRadius="[5px]"
            classes="invisible absolute -right-[30px] top-[50px] md:left-[50px] md:-top-[15px] z-10 w-48 group-hover:visible"
          >
            <p className="rounded-[5px] bg-black p-s1 text-sm">{tooltip}</p>
          </Border>
        </div>
      )}
    </label>
  );
};

export default CheckBox;

