import React, { useState, useEffect,  } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { makeRequest } from '../../axios';
import { isAdmin } from '../../utils/roles';
import { FaTrashAlt } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { statusChecker } from '../../utils/status';
import { useParams } from 'react-router-dom';

function Posts() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };
  
  const handleDelete = (user) => {
    setEditingUser(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEditingUser(null);
  };

  const handleUpdateUser = async () => {
    try {
      if (!editingUser || !editingUser.id) {
        console.error('Invalid user data');
        return;
      }
  
      const userToUpdate = users.find(user => user.id === editingUser.id);
      await makeRequest.put(`/posts/update-post/${editingUser.id}`, {
        donationStatus: editingUser.donationStatus,
        location: editingUser.location,
        userId: userToUpdate.userId
      });
      
      const response = await makeRequest.get(`/posts/get-own-posts/${id}`);
      setUsers(response.data);
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  
  
  const handleConfirmDelete = async () => {
    try {
      if (!editingUser || !editingUser.id) {
        console.error('Invalid user data');
        return;
      }
  
      const postId = editingUser.id;
  
      await makeRequest.delete(`/posts/${postId}`);
      
      const response = await makeRequest.get(`/posts/get-own-posts/${id}`);
      setUsers(response.data);
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query);
    setCurrentPage(1);
  
    const filteredUsers = users.filter(user => {
      // Add null check for user and user properties
      if (!user || !user.id || !user.donationStatus || !user.donatorType || !user.location) {
        return false; // If any property is null, skip this user
      }
  
      // Convert user id to string before calling toLowerCase()
      const userId = String(user.id);
      return (
        userId.toLowerCase().includes(query) ||
        user.donationStatus.toLowerCase().includes(query) ||
        user.location.toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filteredUsers);
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const renderItems = searchQuery ? filteredUsers : users;
  const currentItems = renderItems.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className='p-2 text-center'>
      <Form.Group controlId="formSearch">
        <Form.Control 
          type="text" 
          placeholder="Search" 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />
      </Form.Group>

      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Donator Type</th>
            <th>Donation status</th>
            <th>Location</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
            {currentItems.map((user, index) => (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{isAdmin(user) ? "Admin" : "User"}</td>
                    <td>{user.donatorType}</td>
                    <td>
                        <span className={statusChecker(user) + " p-1 rounded"}>
                            {user.donationStatus}
                        </span>
                    </td>
                    <td>{user.location}</td>
                    <td>
                        <Button variant="info" onClick={() => handleEdit(user)}><FaPenToSquare className='text-white'/></Button>
                    </td>
                    <td>
                        <Button variant="danger" onClick={() => handleDelete(user)}> <FaTrashAlt/></Button>
                    </td>
                </tr>
            ))}
        </tbody>
      </Table>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group controlId="formDonationStatus">
                <Form.Label>Donation Status</Form.Label>
                <Form.Control
                type="text"
                value={editingUser?.donationStatus || ''}
                onChange={(e) => setEditingUser({ ...editingUser, donationStatus: e.target.value })}
                />
            </Form.Group>
            <Form.Group controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                type="text"
                value={editingUser?.location || ''} 
                onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateUser}>Save Changes</Button>
        </Modal.Footer>
        </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <div className="d-flex justify-content-center">
        <Button
          variant="outline-secondary"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {[...Array(Math.ceil(users.length / itemsPerPage)).keys()].map((number) => (
          <Button
            key={number}
            variant={currentPage === number + 1 ? "primary" : "outline-secondary"}
            onClick={() => paginate(number + 1)}
            className="mx-1"
          >
            {number + 1}
          </Button>
        ))}
        <Button
          variant="outline-secondary"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= users.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Posts;
