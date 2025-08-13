import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../app/hooks';
import { createPost } from './postSlice';

const PostForm = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .required('Title is required'),
      content: Yup.string()
        .min(10, 'Content must be at least 10 characters')
        .required('Content is required'),
    }),
    onSubmit: values => {
      dispatch(createPost(values));
      formik.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <div style={{ color: 'red' }}>{formik.errors.title}</div>
        )}
      </div>

      <div>
        <textarea
          name="content"
          placeholder="Content"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.content && formik.errors.content && (
          <div style={{ color: 'red' }}>{formik.errors.content}</div>
        )}
      </div>

      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
