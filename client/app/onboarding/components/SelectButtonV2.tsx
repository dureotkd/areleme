import React from 'react';

type ItemsType = {
  code: string;
  name: string;
};

function SelectButtonV2(props: { items: ItemsType[]; multiple?: boolean; onClick: Function }) {
  const [selectValue, setSelectValue] = React.useState<string[]>([]);

  const handleOnClick = React.useCallback(
    async (value: string) => {
      const actionType = selectValue.includes(value) ? 'DELETE' : 'INSERT';

      console.log(actionType);

      const cloneSelectValue = [...selectValue].filter((item) => item !== 'all');

      switch (actionType) {
        case 'INSERT':
          cloneSelectValue.push(value);
          setSelectValue(cloneSelectValue);

          break;

        case 'DELETE':
          const newSelectValue = [...selectValue].filter((item) => item !== value);
          setSelectValue(newSelectValue.length > 0 ? newSelectValue : ['']);

          break;
      }
    },
    [selectValue],
  );

  return (
    <>
      {props.items.map(({ code, name }: { code: string; name: string }) => {
        return (
          <button
            key={`${name}-${code}`}
            className={`${
              selectValue.includes(code) ? 'selected' : ''
            } bg-silver pl-md pr-md pt-sm pb-sm mr-md mb-md rounded-md text-sm`}
            type="button"
            value={code}
            onClick={async () => {
              if (props?.onClick) {
                await props.onClick(code);
                handleOnClick(code);
              }
            }}
          >
            {name}
          </button>
        );
      })}
    </>
  );
}

export default SelectButtonV2;
