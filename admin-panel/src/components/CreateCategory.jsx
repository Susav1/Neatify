import React, { useState } from "react";
import axios from "axios";
const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [icon, setIcon] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("icon", icon);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/category",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Category created successfully:", response.data);
      // Reset form and show success message
      setCategoryName("");
      setIcon(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(
        "Error creating category:",
        error.response?.data || error.message
      );
      alert("Failed to create category.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create New Category</h2>

      {success && (
        <div style={styles.success}>Category created successfully!</div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Icon</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIcon(e.target.files[0])}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Create Category
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
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default CreateCategory;
