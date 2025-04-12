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
        duration,
      };

      const response = await axios.post(
        "http://localhost:5000/services",
        newService
      );
      alert("Service created successfully!");
      console.log(response.data);

      // Clear fields after successful submission
      setName("");
      setDescription("");
      setPrice("");
      setDuration("");
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Failed to create service.");
    }
  };

  return <>Hello </>;
};
export default CreateService;
