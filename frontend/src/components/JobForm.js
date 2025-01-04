import React from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';

const JobForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      const formValues = {
        ...initialValues,
        applied_date: initialValues?.applied_date ? moment(initialValues.applied_date) : moment(),
        salary: initialValues?.salary ? parseInt(initialValues.salary, 10) : null
      };
      console.log('Setting initial values:', formValues);
      form.setFieldsValue(formValues);
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    console.log('Raw form values:', values);
    
    const formattedValues = {
      ...values,
      applied_date: values.applied_date.format('YYYY-MM-DD'),
      salary: values.salary ? parseInt(values.salary, 10) : null
    };
    
    console.log('Submitting values:', formattedValues);
    onSubmit(formattedValues);
  };

  return (
    <Modal
      title={initialValues ? "Edit Job" : "Add Job"}
      open={visible}
      onCancel={onCancel}
      okText="Save"
      onOk={() => {
        form.validateFields()
          .then(handleSubmit)
          .catch(info => {
            console.error('Validation failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ 
          status: 'applied',
          applied_date: moment()
        }}
      >
        <Form.Item
          name="company"
          label="Company"
          rules={[{ required: true, message: 'Please enter company name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: 'Please enter position' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="salary"
          label="Salary"
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => (value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
            parser={value => {
              const parsed = value.replace(/\$\s?|(,*)/g, '');
              console.log('Parsed salary:', parsed);
              return parsed;
            }}
            min={0}
            step={1000}
            placeholder="Enter salary amount"
            onChange={(value) => {
              console.log('Salary changed:', value);
            }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
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
          rules={[{ required: true, message: 'Please select date' }]}
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