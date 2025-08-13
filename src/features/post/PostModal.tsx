import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createPost, updatePost } from './postSlice';
import { useAppDispatch } from '../../app/hooks';
import type { Post } from '../../types/Post';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Post; // optional for edit mode
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, initialData }) => {
  const dispatch = useAppDispatch();
  const isEditMode = Boolean(initialData);

  const formik = useFormik({
    initialValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
    enableReinitialize: true, // important for edit mode
    validationSchema: Yup.object({
      title: Yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
      content: Yup.string().min(10, 'Content must be at least 10 characters').required('Content is required'),
    }),
    onSubmit: values => {
      if (isEditMode && initialData?.id) {
        dispatch(updatePost({ ...values, id: initialData.id, userId: initialData.userId }));
      } else {
        dispatch(createPost(values));
      }
      formik.resetForm();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">{isEditMode ? 'Edit Post' : 'Create New Post'}</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mb-2 p-2 border"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}

          <textarea
            name="content"
            placeholder="Content"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mb-2 p-2 border"
          />
          {formik.touched.content && formik.errors.content && (
            <div className="text-red-500 text-sm">{formik.errors.content}</div>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {isEditMode ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
