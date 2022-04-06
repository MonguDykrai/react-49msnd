import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Select } from 'antd';

const App = () => {
  const [storeOptions, setStoreOptions] = useState({
    lanes: [],
    emergencyLanes: [],
  });

  useEffect(() => {
    const lanes = [
      { name: '车道1', id: '245bc21e-4ecf-4615-80c0-75177d48a4fa' },
      { name: '车道2', id: 'df002d24-26a7-41e3-8de5-ac76fa83ece4' },
    ];
    const emergencyLanes = [
      { name: '应急车道1', id: '0e5bc8f4-d7f2-4386-91d0-ded36a1f896c' },
      { name: '应急车道2', id: '1400830b-bb1f-426e-b06a-2ec0c6557270' },
    ];
    setStoreOptions({
      lanes,
      emergencyLanes,
    });
  }, []);

  const [selectOptions, setSelectOptions] = useState(
    'f5469a18-9e07-4563-960d-05702f7592e0'
  );

  useEffect(() => {
    const { lanes, emergencyLanes } = storeOptions;
    selectOptions([...lanes, emergencyLanes]);
  }, [storeOptions]);
  return (
    <Select
      // value={value}
      value={[
        { label: '车道1', value: '245bc21e-4ecf-4615-80c0-75177d48a4fa' },
      ]}
      onChange={(value) => {
        console.log(value);
      }}
      style={{ width: 120 }}
      options={[
        { label: '车道1', value: '245bc21e-4ecf-4615-80c0-75177d48a4fa' },
        { label: '车道2', value: 'fdf002d24-26a7-41e3-8de5-ac76fa83ece4' },
      ]}
      labelInValue
      mode="multiple"
    />
  );
};

ReactDOM.render(<App />, document.getElementById('container'));
