import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterusers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState ({name: "", age: "", profession: ""});

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterusers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  //Search Function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user)=>user.name.
    toLowerCase().includes(searchText) || user.profession.
    toLowerCase().includes(searchText));
    setFilterusers(filteredUsers);
  };
  
  //Delete Function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are You Sure you want to Delete this User?")
    if(isConfirmed) {
    await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
      setUsers(res.data);
      setFilterusers(res.data);
    });
  }
  };
  
  //Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers();
  };

  //Add User
  const handleAddRecord = () => {
    setUserData({name: "", age: "", profession: ""});
    setIsModalOpen(true);
  };

  //handledate
  const handleData = (e) => {
  setUserData({...userData,[e.target.name]: e.target.value});
  };

  //handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      await axios.patch(`http://localhost:8000/users/${userData.id}`, userData).then((res) => {
        console.log(res);
      });
    } else {
    await axios.post("http://localhost:8000/users", userData).then((res) => {
      console.log(res);
    });
  }
  closeModal();
  setUserData({name: "", age: "", profession: ""});
  };

  //Update User Function
  const handleUpdateRecord = (user) => {
   setUserData(user);
   setIsModalOpen(true);
  };
  return (
    <>
      <div className="container">
        <h3>CRUD Application</h3>
        <div className="input-search">
          <input type="search" placeholder="Search Here" onChange={handleSearchChange} />
          <button className="btn blue" onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Age</th>
              <th>profession</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterusers && 
             filterusers.map((user, index) => (
              <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.profession}</td>
              <td>
                <button className="btn blue" onClick={()=>handleUpdateRecord(user)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)} className="btn red">Delete</button>
              </td>
              </tr>
              ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>
                {userData.id ? "Update Record" : "Add Record"}
              </h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userData.name} name="name" id="name" onChange={handleData}/>
              </div>              
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" value={userData.age} name="age" id="age" onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="profession">profession</label>
                <input type="text" value={userData.profession} name="profession" id="profession" onChange={handleData}/>
              </div>
              <button className="btn blue" onClick={handleSubmit}> {userData.id ? "Update User" : "Add User"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;