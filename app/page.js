'use client';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap'; // Use React-Bootstrap for modals

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    address: '', 
    group: '', 
    image: ''
  });

  useEffect(() => {
    fetchContacts();
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost/api/quiz2/contacts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'getContacts' }),
      });
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost/api/quiz2/contacts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'getGroups' }),
      });
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost/api/quiz2/contacts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'getUsers' }),
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleView = (index) => {
    setSelectedContact(contacts[index]);
    setViewModal(true);
  };

  const handleEdit = (index) => {
    const contact = contacts[index];
    setFormData({
      name: contact.contact_name,
      phone: contact.contact_phone,
      email: contact.contact_email || '',
      address: contact.contact_address || '',
      group: contact.grp_id || '',
      image: contact.contact_image || ''
    });
    setEditIndex(index);
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    const contact = contacts[editIndex];
    try {
      const response = await fetch('http://localhost/api/quiz2/contacts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'updateContact',
          contact_id: contact.contact_id,
          contact_name: formData.name,
          contact_phone: formData.phone,
          contact_email: formData.email,
          contact_address: formData.address,
          contact_group: formData.group,
          contact_image: formData.image,
        }),
      });
      const data = await response.json();
      if (data.status === 1) {
        fetchContacts();
        setEditModal(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDelete = (index) => {
    setSelectedContact(contacts[index]);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch('http://localhost/api/quiz2/contacts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'deleteContact',
          contact_id: selectedContact.contact_id,
        }),
      });
      const data = await response.json();
      if (data.status === 1) {
        fetchContacts();
        setDeleteModal(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div>
      <h1 className="text-5xl font-bold mb-8 ml-8 text-left">Contact Manager</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Contact Records</h2>
        <table>
          <thead>
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.contact_id}>
                <td className="p-2">{contact.contact_name}</td>
                <td className="p-2">{contact.contact_phone}</td>
                <td className="p-2">
                  <button onClick={() => handleView(index)} className="mr-2 p-1 bg-blue-500 rounded">
                    View
                  </button>
                  <button onClick={() => handleEdit(index)} className="mr-2 p-1 bg-yellow-500 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(index)} className="p-1 bg-red-600 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedContact && (
        <Modal show={viewModal} onHide={() => setViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>View Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Name: {selectedContact.contact_name}</p>
            <p>Phone: {selectedContact.contact_phone}</p>
            <p>Email: {selectedContact.contact_email}</p>
            <p>Address: {selectedContact.contact_address}</p>
            <p>Group: {selectedContact.grp_name}</p>
            <p>User: {selectedContact.usr_fullname}</p>
            {selectedContact.contact_image && (
              <img 
                src={`http://localhost/contacts/images/${selectedContact.contact_image}`} 
                alt="Contact" 
                className="mt-2 w-full"
              />
            )}
          </Modal.Body>
        </Modal>
      )}

      {/* Edit Modal */}
      {editModal && (
        <Modal show={editModal} onHide={() => setEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-4">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label>Group</label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full p-2 text-black"
                >
                  <option value="">Select Group</option>
                  {groups.map((group) => (
                    <option key={group.grp_id} value={group.grp_id}>
                      {group.grp_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2 text-black"
                />
              </div>
              <button
                type="button"
                onClick={handleEditSubmit}
                className="bg-green-500 p-2 rounded text-white"
              >
                Save Changes
              </button>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModal && selectedContact && (
        <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this contact?</p>
            {/* Displaying contact information */}
            <p><strong>Name:</strong> {selectedContact.contact_name}</p>
            <p><strong>Phone:</strong> {selectedContact.contact_phone}</p>
            <p><strong>Email:</strong> {selectedContact.contact_email || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedContact.contact_address || 'N/A'}</p>
            <p><strong>Group:</strong> {selectedContact.grp_name || 'N/A'}</p>
            <p><strong>User:</strong> {selectedContact.usr_fullname || 'N/A'}</p>
            {selectedContact.contact_image && (
              <img 
                src={`http://localhost/contacts/images/${selectedContact.contact_image}`} 
                alt="Contact" 
                className="mt-2 w-full"
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <button onClick={confirmDelete} className="bg-red-500 p-2 rounded text-white">
              Yes, Delete
            </button>
            <button onClick={() => setDeleteModal(false)} className="bg-gray-500 p-2 rounded text-white">
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      )}

    </div>
  );
}