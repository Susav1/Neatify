import React, { useState } from "react";
import axios from "axios";

const CreateService = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newService = {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
      };

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/services/create",
        newService,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Service created successfully!");
      console.log(response.data);

      setName("");
      setDescription("");
      setPrice(0);
      setDuration(0);
    } catch (error) {
      console.error(
        "Error creating service:",
        error.response?.data || error.message
      );
      alert("Failed to create service.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create a New Service</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          style={styles.textarea}
          placeholder="Service Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Duration (e.g., 1 hour)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>
          Create Service
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px",
  },
  textarea: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px",
    height: "80px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default CreateService;
