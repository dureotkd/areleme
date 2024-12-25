'use client';

export default function SelectBt(props: { code: string; name: string; onClick: React.MouseEventHandler }) {
  return (
    <button
      onClick={props.onClick}
      className="bg-silver pl-md pr-md pt-sm pb-sm mr-md mb-md rounded-md text-base"
    >
      {props.name}
    </button>
  );
}
