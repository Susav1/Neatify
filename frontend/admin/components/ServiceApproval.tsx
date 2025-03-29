// /frontend/admin/components/ServiceApproval.tsx
import React from "react";
import { approveService, rejectService } from "../api/adminApi";

interface Service {
  _id: string;
  name: string;
  status: string;
}

interface ServiceApprovalProps {
  service: Service;
  onApprove: (serviceId: string) => void;
  onReject: (serviceId: string) => void;
}

const ServiceApproval: React.FC<ServiceApprovalProps> = ({
  service,
  onApprove,
  onReject,
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h3 className="text-lg font-semibold">{service.name}</h3>
        <p>Status: {service.status}</p>
      </div>
      <div>
        {service.status !== "approved" && (
          <button
            onClick={() => onApprove(service._id)}
            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
          >
            Approve
          </button>
        )}
        {service.status !== "rejected" && (
          <button
            onClick={() => onReject(service._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceApproval;
