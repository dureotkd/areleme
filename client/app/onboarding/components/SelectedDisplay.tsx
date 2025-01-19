import React from 'react';

function SelectedDisplay({ className = '' }) {
  const [selected, setSelected] = React.useState([]);

  React.useEffect(() => {
    try {
      const onDataNameJson = window.localStorage.getItem('on_data_name') as string;
      const onDataName = JSON.parse(onDataNameJson);

      if (onDataName) {
        setSelected(onDataName);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <ul className={className}>
      <li className="text-blue100">{selected.length > 0 && selected.join(' > ')}</li>
    </ul>
  );
}

export default SelectedDisplay;
