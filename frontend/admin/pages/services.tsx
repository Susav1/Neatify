// /frontend/admin/pages/services.tsx
import React, { useEffect, useState } from "react";
import { getServices, approveService, rejectService } from "../api/adminApi";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ServiceApproval from "../components/ServiceApproval";

interface Service {
  _id: string;
  name: string;
  status: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices();
      setServices(data);
    };

    fetchServices();
  }, []);

  const handleApprove = async (serviceId: string) => {
    await approveService(serviceId);
    setServices(services.map((service) => 
      service._id === serviceId ? { ...service, status: "approved" } : service
    ));
  };

  const handleReject = async (serviceId: string) => {
    await rejectService(serviceId);
    setServices(services.map((service) => 
      service._id === serviceId ? { ...service, status: "rejected" } : service
    ));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <h2 className="text-xl font-semibold">Manage Services</h2>
          {services.map((service) => (
            <ServiceApproval
              key={service._id}
              service={service}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
