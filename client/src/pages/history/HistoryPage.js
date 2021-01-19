import React, { useEffect, useState } from "react";
import moment from "moment";
import { Tag, Button, Table } from "antd";
import agent from "../../utils/agent";
import helpers from "../../utils/helper";
import config from "../../config";
function HistoryPage() {
  const [histories, setHistories] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    agent
      .get("/history")
      .then((res) => {
        setHistories(res.data);
      })
      .catch(helpers.notifyError)
      .finally(() => setLoading(false));
  }, []);
  const columns = [
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (createdAt) => moment(createdAt).format("DD/MM/YYYY \n HH:mm "),
    },
    {
      title: "Loại",
      dataIndex: "historyType",
      render: (historyType) => {
        const color =
          historyType === "convert-uid-to-phone" ? "geekblue" : "green";
        return <Tag color={color}>{historyType}</Tag>;
      },
    },
    {
      title: "Thành công",
      dataIndex: "successCount",
      key: "totalCount",
    },
    {
      title: "Tất cả",
      dataIndex: "totalCount",
      key: "totalCount",
    },
    {
      title: "Point",
      dataIndex: "point",
      key: "point",
      render: (point) => <Tag color="red">{point}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "_id",
      key: "_id",
      render: () => <Tag color="geekblue">Xong</Tag>,
    },
    {
      title: "Download",
      dataIndex: "inputPath",
      key: "inputPath",
      render: (inputPath, history) => {
        return (
          <div>
            <a
              target="_blank"
              href={
                config.restAPIServer +
                "/history/" +
                history._id +
                "/download?type=input"
              }
              style={{ marginRight: 10 }}
            >
              Input
            </a>
            <a
              target="_blank"
              href={
                config.restAPIServer +
                "/history/" +
                history._id +
                "/download?type=output"
              }
              style={{ marginRight: 10 }}
            >
              Output
            </a>
          </div>
        );
      },
    },
  ];

  return <Table dataSource={histories} columns={columns} loading={isLoading} />;
}

export default HistoryPage;
