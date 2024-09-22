import React, { useState, useEffect } from "react";
import {makeRequest} from "../../axios.js";
import "./admin.scss";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    // Fetch the users on component mount
    makeRequest.get("/admin/users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setUpdatedData(user); // Copy current user data for editing
  };

  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (id) => {
    makeRequest.put(`/admin/users/${id}`, updatedData).then(() => {
      setEditingUser(null); // Stop editing
      setUsers(
        users.map((user) => (user.id === id ? updatedData : user))
      );
    });
  };

  const handleDelete = (id) => {
    makeRequest.delete(`/admin/users/${id}`).then(() => {
      setUsers(users.filter((user) => user.id !== id));
    });
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Name</th>
            <th>City</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {editingUser === user.id ? (
                <>
                  <td>
                    <input
                      className="input"
                      name="username"
                      value={updatedData.username}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      name="email"
                      value={updatedData.email}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      name="name"
                      value={updatedData.name}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      name="city"
                      value={updatedData.city}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      name="website"
                      value={updatedData.website}
                      onChange={handleChange}
                    />
                  </td>
                  <td className="actions">
                    <button
                      className="button updateButton"
                      onClick={() => handleUpdate(user.id)}
                    >
                      Update
                    </button>
                    <button
                      className="button cancelButton"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.city}</td>
                  <td>{user.website}</td>
                  <td className="actions">
                    <button
                      className="button editButton"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="button deleteButton"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
