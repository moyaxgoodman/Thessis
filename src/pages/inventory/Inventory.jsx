import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { makeRequest } from '../../axios';
import { isAdmin } from '../../utils/roles';
import { statusChecker } from '../../utils/status';

function Inventory() {
  const [users, setUsers] = useState([]);
  const [searchType, setSearchType] = useState('all'); // Default search type
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Adjust items per page as needed
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await makeRequest.get(`/posts`);
        setUsers(response.data);
        console.log(response)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchTypeChange = (e) => {
    const type = e.target.value;
    setSearchType(type);
    setSearchQuery(''); // Reset search query when search type changes
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  useEffect(() => {
    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        const userDonatorType = user?.donatorType?.toLowerCase();
    
        if (searchType === 'all') {
            // Filter based on name only
            return user?.name?.toLowerCase().includes(query);
        } else {
            // Filter based on donator type and name
            return userDonatorType === searchType && user?.name?.toLowerCase().includes(query);
        }
    });
    
    setFilteredUsers(filteredUsers);
  }, [users, searchQuery, searchType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className='p-2 text-center'>
      <Form.Group controlId="formSearch" className='d-flex gap-2'>
        <Form.Control
          as="select"
          value={searchType}
          onChange={handleSearchTypeChange}
        >
          <option value="all">All</option>
          <option value="donor">Donor</option>
          <option value="recipient">Recipient</option>
        </Form.Control>
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
          Previous
        </Button>
        {[...Array(Math.ceil(filteredUsers.length / itemsPerPage)).keys()].map((number) => (
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
          disabled={indexOfLastItem >= filteredUsers.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Inventory;
