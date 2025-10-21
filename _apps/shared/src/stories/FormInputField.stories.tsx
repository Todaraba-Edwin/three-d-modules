import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormInputField } from '../components/inputs/FormInputField';

const meta: Meta<typeof FormInputField> = {
  title: 'COMMON/FORMS/FormInputField',
  component: FormInputField,
  parameters: {
    layout: 'centered',
  },
  // eslint-disable-next-line
  decorators: [Story => <Story />],
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'file'] },
    isError: { control: 'boolean' },
    isSuccess: { control: 'boolean' },
    isFullSpan: { control: 'number' },
  },
  args: {
    label: 'ID',
    type: 'text',
    placeholder: '아이디를 입력해주세요',
    variant: 'default',
    isStorybook: true,
    isSuccess: true,
    isError: false,
    autoComplete: 'off',
    messages: {
      success: '유효성 통과시의 메시지를 넣어주세요.',
      error: '유효성 실패시의 메시지를 넣어주세요.',
    },
    preSignedUrls: [],
    fileAccept: [],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const stories = {
  DEFAULT: {
    args: {
      label: 'ID',
      type: 'text',
      placeholder: '아이디를 입력하세요',
      isSuccess: false,
    },
  },
  EMAIL: {
    args: {
      label: 'Email',
      type: 'email',
      value: 'test@text.com',
      onChange: () => {},
      placeholder: '이메일을 입력하세요',
      messages: {
        success: '사용가능한 이메일 입니다.',
        error: '',
      },
    },
  },
  PASSWORD: {
    args: {
      label: 'Password',
      type: 'password',
      value: '1234',
      onChange: () => {},
      placeholder: '비밀번호를 입력하세요',
      isError: true,
      messages: {
        success: '',
        error: '사용이 불가능한 비밀번호 입니다.',
      },
    },
  },
  IMAGE_UPLOAD_SINGLE: {
    render: function Render() {
      const { register, watch, setValue } = useForm<{
        fileList: FileList | undefined;
        preSignedUrls: string[];
      }>({
        defaultValues: {
          fileList: undefined,
          preSignedUrls: ['/imgs/no_image.jpg'],
        },
      });

      const fileList = watch('fileList');
      const preSignedUrls = watch('preSignedUrls');

      useEffect(() => {
        if (fileList && fileList.length > 0) {
          const newUrls = Array.from(fileList).map(() => '/imgs/no_image.jpg');
          setValue('preSignedUrls', [...preSignedUrls, ...newUrls]);
          const dt = new DataTransfer();
          setValue('fileList', dt.files);
        }
      }, [fileList, preSignedUrls, setValue]);

      const onRemoveFile = ({
        targetUrl,
      }: {
        targetUrl: string;
      }): undefined => {
        setValue(
          'preSignedUrls',
          watch('preSignedUrls').filter(url => url !== targetUrl)
        );
      };

      return (
        <FormInputField
          isStorybook
          label='이미지 등록'
          type='file'
          preSignedUrls={preSignedUrls}
          onRemoveFile={onRemoveFile}
          fileAccept={['image/*']}
          {...register('fileList')}
        />
      );
    },
  },
  IMAGE_UPLOAD_MULTIPLE: {
    render: function Render() {
      const { register, watch, setValue } = useForm<{
        fileList: FileList | undefined;
        preSignedUrls: string[];
      }>({
        defaultValues: {
          fileList: undefined,
          preSignedUrls: ['/imgs/no_image.jpg', '/imgs/no_image.jpg'],
        },
      });

      const fileList = watch('fileList');
      const preSignedUrls = watch('preSignedUrls');

      useEffect(() => {
        if (fileList && fileList.length > 0) {
          const newUrls = Array.from(fileList).map(() => '/imgs/no_image.jpg');
          setValue('preSignedUrls', [...preSignedUrls, ...newUrls]);
          const dt = new DataTransfer();
          setValue('fileList', dt.files);
        }
      }, [fileList, preSignedUrls, setValue]);

      const onRemoveFile = (): undefined => {
        setValue('preSignedUrls', watch('preSignedUrls').slice(1));
      };

      return (
        <FormInputField
          isStorybook
          label='이미지 등록'
          type='file'
          multiple
          preSignedUrls={preSignedUrls}
          onRemoveFile={onRemoveFile}
          fileAccept={['image/*']}
          {...register('fileList')}
        />
      );
    },
  },
} satisfies Record<string, Story>;

export const DEFAULT = stories.DEFAULT;
export const EMAIL = stories.EMAIL;
export const PASSWORD = stories.PASSWORD;
export const IMAGE_UPLOAD_SINGLE = stories.IMAGE_UPLOAD_SINGLE;
export const IMAGE_UPLOAD_MULTIPLE = stories.IMAGE_UPLOAD_MULTIPLE;
