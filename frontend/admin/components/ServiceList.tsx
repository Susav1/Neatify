import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the Service type
interface Service {
  _id: string;
  name: string;
  status: string;
}

const ServiceList = () => {
  const [services, setServices] = useState<Service[]>([]); // Now TypeScript knows this is an array of Service objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/admin/services", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Use the token from local storage or cookie
          },
        });
        setServices(response.data); // No error because services is now typed as Service[]
        setLoading(false);
      } catch (err) {
        setError("Failed to load services.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const approveService = async (serviceId: string) => {
    try {
      await axios.put(`/api/admin/approve-service/${serviceId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure JWT is included
        },
      });
      setServices(services.map(service => 
        service._id === serviceId ? { ...service, status: "approved" } : service
      ));
    } catch (err) {
      setError("Failed to approve service.");
    }
  };

  const rejectService = async (serviceId: string) => {
    try {
      await axios.put(`/api/admin/reject-service/${serviceId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure JWT is included
        },
      });
      setServices(services.map(service => 
        service._id === serviceId ? { ...service, status: "rejected" } : service
      ));
    } catch (err) {
      setError("Failed to reject service.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Services</h2>
      <ul>
        {services.map(service => (
          <li key={service._id}>
            <h3>{service.name}</h3>
            <p>Status: {service.status}</p>
            <button onClick={() => approveService(service._id)}>Approve</button>
            <button onClick={() => rejectService(service._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
