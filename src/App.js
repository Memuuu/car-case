import { useEffect, useState } from "react";
import { Button, Table, Modal, Input, Checkbox, Select, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./App.css";
import axios from "axios";
import dayjs from "dayjs";

function App() {
  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Brand",
      dataIndex: "brand",
    },
    {
      key: "3",
      title: "Year",
      dataIndex: "year",
    },
    {
      key: "4",
      title: "Model",
      dataIndex: "model",
    },
    {
      key: "5",
      title: "Color",
      dataIndex: "color",
    },
    {
      key: "6",
      title: "SunRoof",
      dataIndex: "sunRoof",
      align: 'center',
      render: (value) => (
        value
          ? "Evet"
          : "Hayır"
      )
    },
    {
      key: "7",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                setIsModalVisible(true);
                setIsEditCar(true)
                setModalCar({ ...record });
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteCar(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  const { Option } = Select;
  const [dataSource, setDataSource] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditCar, setIsEditCar] = useState(false);
  const [modalCar, setModalCar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    getCars();
  }, [])

  const getCars = async () => {
    await axios.get(`https://641aefca1f5d999a4456cddd.mockapi.io/cars`)
      .then(res => {
        setDataSource(res.data)
      })
  }

  const onAddCar = async (newCar) => {
    setIsLoading(true)
    await axios.post(`https://641aefca1f5d999a4456cddd.mockapi.io/cars`, newCar)
      .then(res => {
        setDataSource((prev) => [res.data, ...prev])
      })
    setIsLoading(false)
    resetModal();
  };

  const onDeleteCar = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this car record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios.delete(`https://641aefca1f5d999a4456cddd.mockapi.io/cars/${record.id}`)
          .then(res => {
            setDataSource(dataSource.filter((item) => item.id !== res.data.id))
          })
      },
    });

  };

  const onEditCar = async (editedCar) => {
    setIsLoading(true)
    await axios.put(`https://641aefca1f5d999a4456cddd.mockapi.io/cars/${editedCar.id}`, editedCar)
      .then(res => {
        setDataSource((pre) => {
          return pre.map((car) => {
            if (car.id === modalCar.id) {
              return modalCar;
            } else {
              return car;
            }
          });
        });
      })
    setIsLoading(false)
    resetModal()
  };

  const resetModal = () => {
    setIsModalVisible(false);
    setModalCar(null);
  };

  return (
    <>
      <Button className="mb-5" onClick={() => setIsModalVisible(true)}>Add a new Car</Button>
      <Table pagination={false} columns={columns} dataSource={dataSource} />
      <Modal
        title={isEditCar ? "Edit Car" : "Add Car"}
        visible={isModalVisible}
        okText="Save"
        okButtonProps={{ disabled: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
        onCancel={() => {
          resetModal();
        }}
        onOk={() => {
          if (isEditCar) {
            onEditCar(modalCar)
          } else {
            onAddCar(modalCar)
          }
        }}
      >
        <Input
          placeholder="Brand"
          className="mb-5"
          value={modalCar?.brand}
          onChange={(e) => {
            setModalCar((pre) => {
              return { ...pre, brand: e.target.value };
            });
          }}
        />
        <Input
          placeholder="Model"
          value={modalCar?.model}
          className="mb-5"
          onChange={(e) => {
            setModalCar((pre) => {
              return { ...pre, model: e.target.value };
            });
          }}
        />
        <div className="center">
          <DatePicker
          placeholder={"Year"}
            value={(modalCar?.year) ? dayjs(modalCar?.year) : ""}
            onChange={(e, dateString) => {
              setModalCar((pre) => {
                return { ...pre, year: dateString };
              });
            }}
            picker="year"
            disabledDate={(current) => current.year() < 2000 || current.year() > 2023}
          />
          <Select
            placeholder="Color"
            value={modalCar?.color}
            style={{ width: 120 }}
            onChange={(e) => {
              setModalCar((pre) => {
                return { ...pre, color: e };
              });
            }}
          >
            <Option value="White">White</Option>
            <Option value="Blue">Blue</Option>
            <Option value="Black">Black</Option>
            <Option value="Red">Red</Option>
          </Select>
          <Checkbox
            checked={modalCar?.sunRoof ? true : false}
            onChange={(e) => {
              setModalCar((pre) => {
                return { ...pre, sunRoof: e.target.checked };
              });
            }}>
            Sunroof
          </Checkbox>
        </div>
      </Modal>
    </>
  );
}

export default App;
