import React from 'react';

type Items<T> = {
  [K in keyof T]: T[K];
};

function SelectButtonV2(props: { items: Items<[]>; multiple?: boolean; onClick: React.MouseEventHandler }) {
  const [selectValue, setSelectValue] = React.useState<string[]>([]);

  const handleOnClick = React.useCallback(
    async (value: string) => {
      const actionType = selectValue.includes(value) ? 'DELETE' : 'INSERT';

      const cloneSelectValue = [...selectValue].filter((item) => item !== 'all');

      switch (actionType) {
        case 'INSERT':
          cloneSelectValue.push(value);

          console.log(cloneSelectValue);

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
  //

  return (
    <>
      {props.items.map(({ code, name }: { code: string; name: string }) => {
        return (
          <button
            key={`${name}-${code}`}
            className={`${
              selectValue.includes(code) ? 'selected' : ''
            } bg-silver pl-md pr-md pt-sm pb-sm mr-md mb-md rounded-md text-base`}
            type="button"
            value={code}
            onClick={props.onClick ? props.onClick.bind(this, code) : handleOnClick.bind(this, code)}
          >
            {name}
          </button>
        );
      })}
    </>
  );
}

export default React.memo(SelectButtonV2);