import React, { useState, useEffect, useContext } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { makeRequest } from '../../axios';
import { isAdmin } from '../../utils/roles';
import { statusChecker } from '../../utils/status';
import { AuthContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
function UserBoard() {
  const [users, setUsers] = useState([]);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [fullDescription, setFullDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(""); // Added state for selected image
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await makeRequest.get(`/posts/get-own-posts/${id}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const openDescriptionModal = (desc, img) => { // Modified to accept img parameter
    setFullDescription(desc);
    setSelectedImage(img); // Set selected image URL
    setShowDescriptionModal(true);
  };

  const closeDescriptionModal = () => {
    setShowDescriptionModal(false);
    setFullDescription("");
    setSelectedImage(""); // Reset selected image URL
  };
  return (
    <div className='p-2 text-cente'>
      <Table responsive>
        <thead>
          <tr>
            <th>Description</th>
            <th>DonationStatus</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7">No available post for this user</td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td className='c-pointer'>
                  {user.desc.length > 15 ? (
                    <div
                      className='c-pointer'
                      onClick={() => openDescriptionModal(user.desc, user.img)} // Pass img parameter
                      style={{ textDecoration: 'underline' }}
                    >
                      {`${user.desc.substring(0, 15)}...`}
                    </div>
                  ) : (
                    <div onClick={() => openDescriptionModal(user.desc, user.img)} >
                      {user.desc}
                    </div>
                  )}
                </td>
                <td>
                  <span className={statusChecker(user) + " p-1 rounded"}>
                    {user.donationStatus === null ? "progress" : user.donationStatus}
                  </span>
                </td>
                <td>{user.location === null ? "progress" : user.location}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
        
      <Modal show={showDescriptionModal} onHide={closeDescriptionModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Description</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <img src={selectedImage} alt="" style={{ width: "200px", objectFit: "cover" }} />
          <br />
          {fullDescription}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserBoard;
