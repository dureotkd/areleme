'use client';

import * as React from 'react';
import Slider from '@mui/material/Slider';

type Props = {
  className?: string;
  style?: object;
  step?: number;
  min?: number;
  max?: number;
  value: number[];
  setValue: any;
  onChange?: React.MouseEventHandler;
};

export default function RangeSlider(props: Props) {
  return (
    <Slider
      className={props.className}
      style={{ ...props.style }}
      getAriaLabel={() => 'Temperature range'}
      value={props.value}
      onChange={(event, value) => {
        props.setValue(value as number[]);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props?.onChange && props.onChange(value);
      }}
      valueLabelDisplay="auto"
      step={props?.step || 1}
      min={props?.min || 0}
      max={props.max}
      disableSwap
      sx={{
        '& .MuiSlider-thumb': {
          width: 14, // thumb 너비 변경
          height: 14, // thumb 높이 변경
        },
      }}
    />
  );
}
