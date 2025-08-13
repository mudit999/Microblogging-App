import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchPosts, deletePost } from './postSlice';
import PostModal from './PostModal';
import type { Post } from '../../types/Post';
import { returnUserId } from '../../utils/returnUserId';
import { DangerAlert } from '../dangerAlert';

const PostList = () => {
  const dispatch = useAppDispatch();
  const { allPosts, loading } = useAppSelector(state => state.posts);
  const { user } = useAppSelector(state => state.auth);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [postDeleteId, setPostDeleteId] = useState<string>("");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    console.log("Blog deleted");
    dispatch(deletePost(postDeleteId));
    setShowAlert(false);
  };

  const loggedInUserId = returnUserId();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {allPosts.map(post => (
            <div key={post.id} className="w-64 p-4 bg-white shadow rounded">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              {/* <p>User Id: {post.userId}</p> */}
              <p className="text-sm mt-2">{post.content}</p>

              {user?.role === "Blogger" && loggedInUserId === post.userId ? (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                   onClick={() => {
                    setShowAlert(true)
                    setPostDeleteId(post.id || "")
                    }
                  }
                   className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>) : <div></div>
              }
            </div>
          ))}
        </div>
       )}

      <PostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={selectedPost || undefined}
      />

      {showAlert && (
        <DangerAlert
          message="Are you sure you want to delete this blog? This action cannot be undone."
          onConfirm={() => handleDelete()}
          onCancel={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default PostList;
