'use client';

export default function ViewButton(props: {
  name: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className={`bg-silver rounded-md md:text-base text-sm  ${props.className}`}
      style={{ padding: '4px 6px' }}
      onClick={props.onClick || (() => {})}
    >
      {props.name}
    </button>
  );
}
