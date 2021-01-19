import React, {useState} from 'react';
import {Form, Input} from 'antd'
function InputPostId(props) {
    const [idPost, setIdPost] = useState()
    return (
        <div>
        <Form.Item
          label="ID bài viết "
          name="postId"
          rules={[{ required: true, message: "Ko được để trống trường này !" }]}
        >
          <Input value={idPost} placeholder="ID bài viết ." onChange={e => {
              setIdPost(e.target.value + "asdfds");
          }}></Input>
        </Form.Item>
        </div>
    );
}

export default InputPostId;