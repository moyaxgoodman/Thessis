import { FaFilePen } from "react-icons/fa6";
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { makeRequest } from '../../axios';
import { isAdmin, isDonator } from '../../utils/roles';
import { FaTrashAlt } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { statusChecker } from '../../utils/status';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Change this value to adjust items per page
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await makeRequest.get('/users/all-users');
        setUsers(response.data);
        setSearchResults(response.data); // Initialize search results with all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    const filteredUsers = users.filter(user =>
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.donatorType && user.donatorType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.donationStatus && user.donationStatus.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.donationLocation && user.donationLocation.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults(filteredUsers);
  }, [searchQuery, users]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

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
      // Make the update request with the edited user data
      await makeRequest.put(`/users/update/${editingUser.id}`, editingUser); // Adjust the URL format here
      // Refresh the user list
      const response = await makeRequest.get('/users/all-users');
      setUsers(response.data);
      // Close the edit modal
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // Make the delete request with the user ID
      await makeRequest.delete(`/users/delete/${editingUser.id}`);
      // Refresh the user list
      const response = await makeRequest.get('/users/all-users');
      setUsers(response.data);
      // Close the delete modal
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className='p-2 text-cente'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="form-inline my-2 my-lg-0 d-flex gap-2">
              <input 
                className="form-control mr-sm-2" 
                type="search" 
                placeholder="Search" 
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
          </div>
      </nav>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>View posts</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((user, index) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{isAdmin(user) ? "Admin" : "User"}</td>
              <td>
              <Link to={`/user-posts/${user.id}`}>
                <Button variant="warning" className='text-white'>
                  <FaFilePen />
                </Button>
              </Link>
              </td>
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
      <div className="d-flex justify-content-center">
      <Button
        variant="outline-secondary"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
       <GrPrevious />
      </Button>
      {/* Pagination buttons */}
      {[...Array(Math.min(5, Math.ceil(searchResults.length / itemsPerPage))).keys()].map((number) => {
        const pageNumber = number + 1;
        let pageButton;
        if (currentPage <= 3) {
          pageButton = pageNumber <= 5;
        } else if (currentPage >= Math.ceil(searchResults.length / itemsPerPage) - 2) {
          pageButton = pageNumber >= Math.ceil(searchResults.length / itemsPerPage) - 4;
        } else {
          pageButton = pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2;
        }
        return pageButton ? (
          <Button
            key={number}
            variant={currentPage === pageNumber ? "primary" : "outline-secondary"}
            onClick={() => paginate(pageNumber)}
            className="mx-1"
          >
            {pageNumber}
          </Button>
        ) : null;
      })}
      <Button
        variant="outline-secondary"
        onClick={() => paginate(currentPage + 1)}
        disabled={indexOfLastItem >= searchResults.length}
      >
        <GrNext />
      </Button>
    </div>
    <Modal show={showEditModal} onHide={handleCloseEditModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={editingUser?.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={editingUser?.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} />
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={editingUser?.username} onChange={(e) => setEditingUser({...editingUser, username: e.target.value})} />
          </Form.Group>
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" value={editingUser?.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}>
              <option value={0}>User</option>
              <option value={1}>Admin</option>
            </Form.Control>
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
    </div>
  );
}

export default Dashboard;
