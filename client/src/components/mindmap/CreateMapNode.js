/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/mindmap/CreateNode.js
 * Created:  2019-03-06 16:33:36
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-06 16:33:36
 * Editor:   Darrin Tisdale
 */


import { Modal, Form, Input, message } from "antd";
import React from "react";
const uuidv4 = require('uuid/v4');

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 4 },
    sm: { span: 16 }
  }
};
const CreateMapNode = Form.create()(
  class extends React.Component {
    state = {
      description: "",
      confirmLoading: false
    };
    componentDidMount() {
      message.config({
        top: 100,
        duration: 1.5
      });
    }
    hideModal = () => {
      this.props.handleCancel();
    };
    handleConfirm = () => {
      const form = this.props.form;
      let error = false;
      form.validateFields((err, values) => {
        if (err) {
          error = true;
          return;
        }
      });
      if (error) {
        return;
      }
      const nodeName = form.getFieldValue("nodeName");
      const { description } = this.state;
      this.setState({
        confirmLoading: true
      });
      setTimeout(() => {
        this.setState({
          confirmLoading: false
        });
        const id = uuidv4();
        this.props.handleConfirm({
          type: this.props.currentNode,
          nodeName,
          description,
          id
        });
      }, 1000);
    };
    handleDescChange(e) {
      this.setState({
        description: e.target.value
      });
    }
    render() {
      const form = this.props.form;
      const { getFieldDecorator } = form;
      return (
        <div>
          <Modal
            title="New Node"
            visible={this.props.visible}
            onOk={this.handleConfirm}
            onCancel={this.hideModal}
            confirmLoading={this.state.confirmLoading}
            okText="Confirm"
            cancelText="Cancel"
            width="800px"
          >
            <Form>
              <FormItem
                label="Node Type"
                layout="horizontal"
                {...formItemLayout}
              >
                <Input disabled value={this.props.currentNode} />
              </FormItem>
              <FormItem
                label="Node Name"
                required
                layout="horizontal"
                {...formItemLayout}
              >
                {getFieldDecorator("nodeName", {
                  rules: [{ required: true, message: "This node's name must be provided" }]
                })(<Input />)}
              </FormItem>
              <FormItem
                label="Details"
                layout="horizontal"
                {...formItemLayout}
              >
                <TextArea
                  rows={4}
                  value={this.state.description}
                  onChange={e => this.handleDescChange(e)}
                />
              </FormItem>
            </Form>
          </Modal>
        </div>
      );
    }
  }
);

export default CreateTaskNode;
