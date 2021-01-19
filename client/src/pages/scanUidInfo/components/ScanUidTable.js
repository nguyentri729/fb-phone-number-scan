import React from "react";
import { Table, Tag, Button } from "antd";
import { CSVLink } from "react-csv";

import { DownloadOutlined } from "@ant-design/icons";

import moment from "moment";
const columns = [
  {
    title: "STT",
    key: "index" + Math.random(),
    width: "20px",
    render: (text, record, index) => {
      return index + 1;
    },
  },
  {
    title: "UID",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, row) => (
      <a href={`https://fb.me/${row.id}`} target="_blank">
        {text}
      </a>
    ),
  },
  {
    title: "Gender",
    key: "gender",
    dataIndex: "gender",
    render: (gender, row) => {
      let color = "volcano";
      if (gender === "male") color = "geekblue";

      if (gender === "famale") color = "green";
      return (
        <Tag color={color} key={row.id}>
          {gender.toUpperCase()}
        </Tag>
      );
    },
  },
];

function ScanUidTable({ data, isLoading }) {
  return (
    <>
      <Button
        type="primary"
        style={{ float: "right"}}
        disabled={isLoading}
        icon={<DownloadOutlined />}
      >{" "}
        <CSVLink
          filename={`info-${moment().format("DD.MM.YY")}.csv`}
          data={data}
          style={{color: "white"}}
        >
          Download
        </CSVLink>
      </Button>

      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
}

export default ScanUidTable;
