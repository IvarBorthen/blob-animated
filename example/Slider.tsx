import React, { useState } from 'react';

type Props = {
  min: number;
  max: number;
  step: number;
  value: number;
  title: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider: React.FunctionComponent<Props> = ({
  min, max, step, value, title, name, onChange, 
}) => {
  const [slideValue, setValue] = useState(value);
  return (
    <>
      <label htmlFor={name}>
        {title}
      </label>
      <input
        name={name}
        type="range"
        value={slideValue}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          setValue(Number(e.target.value));
          onChange(e);
        }}
      />
    </>
  )
}

export default Slider;