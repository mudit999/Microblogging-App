import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import PostModal from '../post/PostModal';
import PostList from '../post/PostList';
import { fetchPosts } from '../post/postSlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const {allPosts} = useAppSelector(state => state.posts);
  const { user } = useAppSelector(state => state.auth)

  useEffect(() => {
    dispatch(fetchPosts()); // fetch posts on mount
  }, [dispatch]);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // redirect to login page
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        {user?.role === "Blogger" ? (
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create New Post
        </button>
        ) : <div></div>}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      <PostModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {allPosts.length > 0 ? (
        <PostList />
      ) : (
        <>
        <h2>Welcome👋</h2>
        <p className="text-gray-600">It looks like you haven't shared anything yet. Every great journey begins with a single click</p>
        </>
      )}

    </div>
  );
};

export default Dashboard;
