import { useState } from 'react';
import RadioInput from './RadioInput';

const RadioContent = ({ handleRadioButtonClick, title, name }) => {
  const [selectedOption, setSelectedOption] = useState();
  // const handleRadioButtonClick = (option) => {
  //   setSelectedOption(option);
  //   setData(name, !data);
  // };

  return (
    <div className="flex flex-col">
      <h4>{title}</h4>
      <div className="mb-2">
        <RadioInput
          value={true}
          chosenValue={true}
          label={"Yes, it's made for kids"}
          onChange={() => handleRadioButtonClick(true)}
          name={name}
        />
      </div>
      <RadioInput
        value={false}
        label={"No, it's not made for kids"}
        onChange={() => handleRadioButtonClick(false)}
        name={name}
      />
    </div>
  );
};

export default RadioContent;
