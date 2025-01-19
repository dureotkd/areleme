'use client';

import { useCallback, useState } from 'react';

export default function SelectButton(props: {
  code: string;
  name: string;
  multiple?: boolean;
  onClick: React.MouseEventHandler;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleOnClick = useCallback(
    (event: React.MouseEvent) => {
      if (props.multiple) {
        setSelected((prev) => {
          return [...prev, props.code];
        });
      }

      props.onClick(event);
    },
    [props],
  );

  return (
    <button
      onClick={handleOnClick}
      className="bg-silver pl-md pr-md pt-sm pb-sm mr-md mb-md rounded-md text-base"
    >
      {props.name}
    </button>
  );
}
