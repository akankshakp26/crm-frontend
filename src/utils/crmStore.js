// src/utils/crmStore.js

const LEADS_KEY = "crm_leads";
const CLIENTS_KEY = "crm_clients";

function read(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLeads() {
  return read(LEADS_KEY);
}

export function setLeads(leads) {
  write(LEADS_KEY, leads);
}

export function getClients() {
  return read(CLIENTS_KEY);
}

export function setClients(clients) {
  write(CLIENTS_KEY, clients);
}

export function convertLeadToClient(id) {
  const leads = getLeads();
  const lead = leads.find((l) => l.id === id);

  if (!lead) return;

  const updatedLeads = leads.filter((l) => l.id !== id);
  setLeads(updatedLeads);

  const clients = getClients();
  setClients([lead, ...clients]);
}
