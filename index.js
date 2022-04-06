import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Select } from 'antd';

const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

ReactDOM.render(
  <>
    <Select defaultValue="lucy" style={{ width: 120 }} disabled>
      <Option value="lucy">Lucy</Option>
    </Select>
    <Select defaultValue="lucy" style={{ width: 120 }} loading>
      <Option value="lucy">Lucy</Option>
    </Select>
    <Select defaultValue="lucy" style={{ width: 120 }} allowClear>
      <Option value="lucy">Lucy</Option>
    </Select>
  </>,
  document.getElementById('container')
);
