"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  phone: string;
  businessName: string;
  service: string;
  budget: string;
  message: string | null;
  source: string;
  createdAt: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

type Tab = "leads" | "services";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("leads");
  
  // Leads states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  
  // Services states
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  // Modals / forms state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    icon: "🤖",
    enabled: true,
    sortOrder: 0,
  });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    icon: "",
    enabled: true,
    sortOrder: 0,
  });
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const router = useRouter();

  // Load leads and services on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Fetch leads
    fetch("/api/leads", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setLeads)
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoadingLeads(false));

    // Fetch all services (enabled and disabled) — auth required
    fetch("/api/services?all=true", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load services");
        return res.json();
      })
      .then(setServices)
      .catch((err) => console.error(err))
      .finally(() => setLoadingServices(false));
  }, [router]);

  // Refresh services function
  const refreshServices = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    try {
      const res = await fetch("/api/services?all=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error("Failed to reload services:", err);
    }
  };

  // Export CSV
  const exportCSV = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch("/api/leads/export", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neuraxine-leads-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  // Service: Toggle enable/disable status
  const handleToggleService = async (service: Service) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: !service.enabled }),
      });

      if (res.ok) {
        setSuccessMsg(`Service "${service.title}" ${!service.enabled ? "enabled" : "disabled"}`);
        refreshServices();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Failed to update service status.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  // Service: Delete service
  const handleDeleteService = async (id: string, title: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    if (!confirm(`Are you sure you want to permanently delete service "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSuccessMsg(`Service "${title}" deleted successfully.`);
        refreshServices();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Failed to delete service.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  // Service: Open Edit modal
  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setEditForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
      enabled: service.enabled,
      sortOrder: service.sortOrder,
    });
  };

  // Service: Submit Edit form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    if (!token || !editingService) return;

    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setSuccessMsg(`Service "${editForm.title}" updated successfully.`);
        setEditingService(null);
        refreshServices();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Failed to update service.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  // Service: Submit Add form
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addForm),
      });

      if (res.ok) {
        setSuccessMsg(`Service "${addForm.title}" created successfully.`);
        setIsAddModalOpen(false);
        setAddForm({
          title: "",
          description: "",
          icon: "🤖",
          enabled: true,
          sortOrder: services.length + 1,
        });
        refreshServices();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Failed to create service.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const loading = activeTab === "leads" ? loadingLeads : loadingServices;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-60 flex flex-col gap-2">
        {successMsg && (
          <div className="bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-xs px-4 py-3 rounded-lg shadow-lg backdrop-blur-md">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-lg shadow-lg backdrop-blur-md">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-black">
            <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-neon tracking-widest uppercase">Neuraxine Admin</h1>
            <p className="text-[10px] text-silver/50">Control Center</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-white/5 text-silver/60 text-xs border border-white/10 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-white/5 px-6 bg-black/20 flex gap-6">
        <button
          onClick={() => setActiveTab("leads")}
          className={`py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "leads"
              ? "border-neon text-neon"
              : "border-transparent text-silver/60 hover:text-white"
          }`}
        >
          Leads ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "services"
              ? "border-neon text-neon"
              : "border-transparent text-silver/60 hover:text-white"
          }`}
        >
          Services ({services.length})
        </button>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-neon/20 border-t-neon rounded-full animate-spin" />
          </div>
        ) : activeTab === "leads" ? (
          /* Leads Tab */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white tracking-wider">Demo Booking Leads</h2>
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-lg bg-neon/10 text-neon text-xs border border-neon/30 hover:bg-neon/20 transition-all font-medium cursor-pointer"
              >
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/30 backdrop-blur-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-silver/50 text-xs uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Business</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/1 transition-colors">
                      <td className="p-4 font-semibold text-white">{lead.name}</td>
                      <td className="p-4 text-silver/70">{lead.phone}</td>
                      <td className="p-4 text-silver/70">{lead.businessName}</td>
                      <td className="p-4 text-neon font-medium">{lead.service}</td>
                      <td className="p-4 text-silver/70">{lead.budget}</td>
                      <td className="p-4 text-silver/50 max-w-xs truncate" title={lead.message || ""}>
                        {lead.message || "-"}
                      </td>
                      <td className="p-4 text-silver/50 text-xs">{lead.source}</td>
                      <td className="p-4 text-silver/50 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-silver/30">
                        No leads received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Services Tab */
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-wider">Manage AI Services</h2>
                <p className="text-xs text-silver/50 mt-1">Add, edit, disable, or delete services dynamically</p>
              </div>
              <button
                onClick={() => {
                  setAddForm({ ...addForm, sortOrder: services.length + 1 });
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-neon text-black text-xs font-semibold hover:bg-neon/80 transition-all cursor-pointer shadow-[0_0_12px_rgba(198,255,0,0.2)]"
              >
                + Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`border rounded-xl p-5 bg-black/40 backdrop-blur-md transition-all flex flex-col justify-between ${
                    service.enabled
                      ? "border-white/5 hover:border-white/10"
                      : "border-white/5 opacity-55 hover:opacity-75"
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl bg-white/5 h-10 w-10 flex items-center justify-center rounded-lg border border-white/5">
                          {service.icon}
                        </span>
                        <div>
                          <h3 className="font-semibold text-white text-base leading-tight">{service.title}</h3>
                          <span className="text-[9px] text-silver/40">Sort Order: {service.sortOrder}</span>
                        </div>
                      </div>

                      {/* Status indicator badge */}
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          service.enabled
                            ? "bg-[#22c55e]/10 text-[#22c55e]"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${service.enabled ? "bg-[#22c55e]" : "bg-red-400"}`} />
                        {service.enabled ? "ENABLED" : "DISABLED"}
                      </span>
                    </div>

                    <p className="text-silver/60 text-xs leading-relaxed mb-6 min-h-12 line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleToggleService(service)}
                      className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-all cursor-pointer ${
                        service.enabled
                          ? "bg-red-500/5 text-red-400 border-red-500/10 hover:bg-red-500/10"
                          : "bg-[#22c55e]/5 text-[#22c55e] border-[#22c55e]/10 hover:bg-[#22c55e]/10"
                      }`}
                    >
                      {service.enabled ? "Disable" : "Enable"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(service)}
                        className="text-xs px-2.5 py-1.5 rounded-md bg-white/5 text-silver/80 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id, service.title)}
                        className="text-xs px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {services.length === 0 && (
                <div className="col-span-full border border-dashed border-white/5 rounded-xl py-16 text-center text-silver/30 text-sm bg-black/10">
                  No services configured. Add your first service to show on the website.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="border-b border-white/5 p-5 flex justify-between items-center bg-black/40">
              <h3 className="font-bold text-white text-base">Add New AI Service</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-silver/50 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-silver/50 mb-1.5">Service Icon (Emoji or Symbol)</label>
                <input
                  required
                  type="text"
                  maxLength={5}
                  value={addForm.icon}
                  onChange={(e) => setAddForm({ ...addForm, icon: e.target.value })}
                  placeholder="e.g. 🤖, 💬, 🎙️"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-silver/50 mb-1.5">Service Title</label>
                <input
                  required
                  type="text"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  placeholder="e.g. WhatsApp Automation"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-silver/50 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  placeholder="Describe what this AI service does..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-silver/50 mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={addForm.sortOrder}
                    onChange={(e) => setAddForm({ ...addForm, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="add-enabled"
                    checked={addForm.enabled}
                    onChange={(e) => setAddForm({ ...addForm, enabled: e.target.checked })}
                    className="accent-neon h-4 w-4"
                  />
                  <label htmlFor="add-enabled" className="text-sm text-silver/80 select-none cursor-pointer">Enabled by default</label>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-silver/75 text-xs hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neon text-black text-xs font-semibold hover:bg-neon/85 transition-all"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="border-b border-white/5 p-5 flex justify-between items-center bg-black/40">
              <h3 className="font-bold text-white text-base">Edit AI Service</h3>
              <button
                onClick={() => setEditingService(null)}
                className="text-silver/50 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-silver/50 mb-1.5">Service Icon</label>
                <input
                  required
                  type="text"
                  maxLength={5}
                  value={editForm.icon}
                  onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-silver/50 mb-1.5">Service Title</label>
                <input
                  required
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-silver/50 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-silver/50 mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={editForm.sortOrder}
                    onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="edit-enabled"
                    checked={editForm.enabled}
                    onChange={(e) => setEditForm({ ...editForm, enabled: e.target.checked })}
                    className="accent-neon h-4 w-4"
                  />
                  <label htmlFor="edit-enabled" className="text-sm text-silver/80 select-none cursor-pointer">Enabled</label>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-silver/75 text-xs hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neon text-black text-xs font-semibold hover:bg-neon/85 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
