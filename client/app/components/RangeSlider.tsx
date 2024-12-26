/* eslint-disable @typescript-eslint/no-explicit-any */
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
  marks?: [{ value: number; label: string }];
  onChange: React.MouseEventHandler;
};

export default function RangeSlider(props: Props) {
  return (
    <Slider
      className={props.className}
      style={{ ...props.style }}
      getAriaLabel={() => 'Temperature range'}
      value={props.value}
      onChange={(event, value: number[]) => {
        // props.setValue(value as number[]);
        props.onChange(value);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      }}
      valueLabelDisplay="auto"
      step={props?.step || 1}
      min={props?.min || 0}
      max={props.max}
      disableSwap
      marks={props.marks}
      sx={{
        '& .MuiSlider-thumb': {
          width: 14, // thumb 너비 변경
          height: 14, // thumb 높이 변경
        },
      }}
    />
  );
}
