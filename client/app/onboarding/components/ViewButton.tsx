'use client';

export default function ViewButton(props: { name: string }) {
  return (
    <button type="button" className="bg-silver rounded-md text-base mt-md" style={{ padding: '4px 6px' }}>
      {props.name}
    </button>
  );
}
