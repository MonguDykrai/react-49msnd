import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Select, Form, Input, Button } from 'antd';
import _ from 'lodash';

const App = () => {
  const [form] = Form.useForm();
  // 模拟仓库数据
  const [drawInfo, setDrawInfo] = useState({
    lanes: [],
    emergencyLanes: [],
    jcCollectionModeCoil: {
      collections: [
        {
          id: '1f60bfa8-a72c-4c5f-81a7-3ec682de18ea',
          name: '线圈位置1',
          useForLanes: [
            // { label: '车道1', value: '245bc21e-4ecf-4615-80c0-75177d48a4fa' },
            // 模拟车道已失效
            { label: '车道1', value: '58978fc7-1fee-4d97-97b0-6b702e03fe05' },
          ],
        },
        {
          id: '078c8c7b-f8e7-4408-a8bb-e747b0ea6155',
          name: '线圈位置2',
          useForLanes: [
            {
              label: '应急车道2',
              value: '1400830b-bb1f-426e-b06a-2ec0c6557270',
            },
          ],
        },
      ],
    },
    jcCollectionModeRegion: {
      collections: [],
    },
  });
  // Select选项
  const [selectOptions, setSelectOptions] = useState([]);

  const updateAll = useCallback(
    ({ lanes, emergencyLanes }) => {
      console.log(`updateAll: start`, _.cloneDeep(drawInfo));
      const drawInfoCopy = {
        ...drawInfo,
      };

      if (lanes && emergencyLanes) {
        drawInfoCopy.lanes = lanes;
        drawInfoCopy.emergencyLanes = emergencyLanes;
      }

      if (lanes) {
        drawInfoCopy.lanes = lanes;
      }

      if (emergencyLanes) {
        drawInfoCopy.emergencyLanes = emergencyLanes;
      }

      const selectOptions = [
        ...drawInfoCopy.lanes.map((lane) => ({
          label: lane.name,
          value: lane.id,
        })),
        ...drawInfoCopy.emergencyLanes.map((emergencyLane) => ({
          label: emergencyLane.name,
          value: emergencyLane.id,
        })),
      ];

      // 剔除已失效的选择了的选项
      drawInfoCopy.jcCollectionModeCoil.collections.forEach(
        (collectionItem) => {
          collectionItem.useForLanes = collectionItem.useForLanes.filter(
            (useForLane) => {
              if (
                selectOptions.some(
                  (selectOption) => selectOption.value === useForLane.value
                )
              )
                return true;
              return false;
            }
          );
        }
      );

      console.log(`updateAll: end`, _.cloneDeep(drawInfoCopy));
      setSelectOptions(selectOptions);
      setDrawInfo(drawInfoCopy);
    },
    [setSelectOptions, setDrawInfo, drawInfo]
  );

  // 模拟接口获取车道和应急车道
  useEffect(() => {
    const lanes = [
      { name: '车道1', id: '245bc21e-4ecf-4615-80c0-75177d48a4fa' },
      { name: '车道2', id: 'df002d24-26a7-41e3-8de5-ac76fa83ece4' },
    ];
    const emergencyLanes = [
      { name: '应急车道1', id: '0e5bc8f4-d7f2-4386-91d0-ded36a1f896c' },
      { name: '应急车道2', id: '1400830b-bb1f-426e-b06a-2ec0c6557270' },
    ];
    updateAll({
      lanes,
      emergencyLanes,
    });
  }, []);

  useEffect(() => {
    const drawInfoCopy = _.cloneDeep(drawInfo);
    // 重新设置 form
    drawInfoCopy.jcCollectionModeCoil.collections.forEach(
      (collectionItem, index) => {
        form.setFieldsValue({
          analyze_config: {
            drawInfo: {
              jcCollectionModeCoil: {
                collections: {
                  [index]: {
                    useForLanes: collectionItem.useForLanes,
                  },
                },
              },
            },
          },
        });
      }
    );
  }, [drawInfo]);

  return (
    <>
      <Form
        form={form}
        initialValues={{
          analyze_config: {
            drawInfo: {
              jcCollectionModeCoil: {
                collections: drawInfo.jcCollectionModeCoil.collections,
              },
            },
          },
        }}
      >
        {drawInfo.jcCollectionModeCoil.collections.map((collection, index) => {
          const { id, name, useForLanes } = collection;
          return (
            <div key={id} style={{ display: 'flex', aliginItems: 'center' }}>
              <h4>{name}</h4>
              <Select
                value={useForLanes}
                onChange={(values) => {
                  try {
                    if (values.every((value) => value.label && value.value)) {
                      const drawInfoCopy = _.cloneDeep(drawInfo);
                      drawInfoCopy.jcCollectionModeCoil.collections[
                        index
                      ].useForLanes = values.map((value) => ({
                        label: value.label,
                        value: value.value,
                      }));
                      console.log({
                        drawInfoCopy,
                      });
                      setDrawInfo(drawInfoCopy);
                    } else {
                      throw new Error('Select.onChange: 值类型异常');
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                style={{ width: 120 }}
                options={selectOptions}
                labelInValue
                mode="multiple"
              />
              <Form.Item
                name={[
                  'analyze_config',
                  'drawInfo',
                  'jcCollectionModeCoil',
                  'collections',
                  index,
                  'useForLanes',
                ]}
                // 直接通过 Form initialValues 传入初始值
                // initialValue={useForLanes}
              >
                <Input type="hidden" />
              </Form.Item>
            </div>
          );
        })}
      </Form>

      <div>
        <Button
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                values.analyze_config.drawInfo.jcCollectionModeCoil.collections.forEach(
                  (collection) => {
                    console.table(collection.useForLanes);
                  }
                );
              })
              .catch((errors) => {
                console.log(errors);
              });
          }}
        >
          提交
        </Button>
      </div>

      <div>
        <Button
          onClick={() => {
            const { lanes } = _.cloneDeep(drawInfo);
            if (lanes.some((lane) => lane.name === '车道2')) return;
            lanes.push({
              id: '609dde2b-bc25-4c80-8a87-384d64579fad',
              name: '车道2',
            });
            updateAll({
              lanes,
            });
          }}
        >
          新增车道2
        </Button>
        <Button
          onClick={() => {
            const { lanes } = _.cloneDeep(drawInfo);
            const findIndex = lanes.findIndex((lane) => lane.name === '车道2');
            if (findIndex > -1) {
              lanes.splice(1, 1);
              updateAll({
                lanes,
              });
            }
          }}
        >
          删除车道2
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            const { emergencyLanes } = _.cloneDeep(drawInfo);
            if (
              emergencyLanes.some(
                (emergencyLane) => emergencyLane.name === '应急车道2'
              )
            )
              return;
            emergencyLanes.push({
              id: '47bfe77b-cc3c-4f99-99ad-c1755be4e29a',
              name: '应急车道2',
            });
            updateAll({
              emergencyLanes,
            });
          }}
        >
          新增应急车道2
        </Button>
        <Button
          onClick={() => {
            const { emergencyLanes } = _.cloneDeep(drawInfo);
            const findIndex = emergencyLanes.findIndex(
              (emergencyLane) => emergencyLane.name === '应急车道2'
            );
            if (findIndex > -1) {
              emergencyLanes.splice(1, 1);
              updateAll({
                emergencyLanes,
              });
            }
          }}
        >
          删除应急车道2
        </Button>
      </div>

      {/* <Select
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
      /> */}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('container'));
