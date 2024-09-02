import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Modal,
  Button,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  const handleDeletePost = async() => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();

      if(!res.ok) {
        console.log(data.message);
      } else{
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      
    }
  }


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          if(data.posts.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
  
  //handle Show More

  const handleShowMore = async() => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
     console.log(error); 
    }
  }; 



  

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scr">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
      <Table>
        <TableHead>
          <TableHeadCell>Date updates</TableHeadCell>
          <TableHeadCell>Post Image</TableHeadCell>
          <TableHeadCell>Post Title</TableHeadCell>
          <TableHeadCell>Category</TableHeadCell>
          <TableHeadCell>Delete</TableHeadCell>
          <TableHeadCell>
            <spam>Edit</spam>
          </TableHeadCell>
        </TableHead>
        {userPosts.map((post) => (
          <TableBody className="divide-y">
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>
                {new Date(post.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link to={`/post/${post.slug}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-20 h-10 object-cover bg-gray-500"
                  />
                </Link>
              </TableCell>

              <TableCell>
                <Link
                  to={`/post/${post.slug}`}
                  className="fond-medium text-gray-900 dark:text-white"
                >
                  {post.title}
                </Link>
              </TableCell>

              <TableCell>{post.category}</TableCell>

              <TableCell>
                <spam className="font-medium text-red-600 hover:underline cursor-pointer"
                onClick ={() => {
                  setShowModal(true);
                  setPostIdToDelete(post._id);
                }}
                >
                  Delete
                </spam>
              </TableCell>

              <TableCell>
                <Link to={`/update-post/${post._id}`}>
                  <spam className="font-medium text-green-600 hover:underline cursor-pointer">
                    Edit
                  </spam>
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
      {showMore && (
        <button className="w-full text-teal-500 self-center text-sm py-7" onClick={handleShowMore}>Show More</button>
      )}
      </>
      ) : 
      (<p> You don not have content</p>)
      }
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>

  );

};

export default DashPost;
