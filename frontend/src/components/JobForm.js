import React from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';

const JobForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  // Get current date in user's timezone
  const today = moment().startOf('day');

  // Reset form when modal opens
  const handleOpen = () => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        applied_date: moment(initialValues.applied_date),
        salary: initialValues.salary ? `$${initialValues.salary}` : '$'
      });
    } else {
      // Set default values for new job
      form.setFieldsValue({
        applied_date: today,
        status: 'applied',
        salary: '$'
      });
    }
  };

  const handleSubmit = (values) => {
    // Remove $ from salary and convert to number
    const cleanedValues = {
      ...values,
      salary: values.salary ? Number(values.salary.replace(/[^0-9]/g, '')) : null
    };
    onSubmit(cleanedValues);
  };

  return (
    <Modal
      title={initialValues ? "Edit Job Application" : "Add New Job Application"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      afterOpenChange={(visible) => {
        if (visible) handleOpen();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="company"
          label="Company"
          rules={[{ required: true, message: 'Please enter the company name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: 'Please enter the position' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="salary"
          label="Salary"
        >
          <Input 
            onChange={(e) => {
              let value = e.target.value;
              // Keep only numbers and $
              value = value.replace(/[^0-9$]/g, '');
              // Ensure $ is always at the start
              if (!value.startsWith('$')) {
                value = '$' + value;
              }
              // Update form value
              form.setFieldsValue({ salary: value });
            }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select the status' }]}
        >
          <Select>
            <Select.Option value="applied">Applied</Select.Option>
            <Select.Option value="interviewed">Interviewed</Select.Option>
            <Select.Option value="accepted">Accepted</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="applied_date"
          label="Applied Date"
          rules={[{ required: true, message: 'Please select the applied date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobForm; 