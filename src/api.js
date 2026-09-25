// src/api.js
// The ONLY file that knows how to talk to the backend (fetch calls, URLs,
// error handling). Components call functions like getRings() — never
// fetch() directly. Same principle as db.js on the backend: one place
// to change if the API shape or the auth method ever changes.

const BASE_URL = import.meta.env.VITE_API_URL;


import { authBridge } from './authBridge.js'

async function authHeader() {
    if (!authBridge.getAccessTokenSilently) return {}
    try {
        const token = await authBridge.getAccessTokenSilently()
        return { Authorization: `Bearer ${token}` }
    } catch {
        return {} // nicht eingeloggt oder Token abgelaufen — Backend antwortet dann mit 401
    }
}

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(await authHeader()), ...options.headers },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }
    if (res.status === 204) return null; // DELETE responses have no body
    return res.json();
}

// ---------- rings ----------

export function getRings() {
    return request('/rings');
}

export function createRing({ name, type, goal, color }) {
    return request('/rings', { method: 'POST', body: JSON.stringify({ name, type, goal, color }) });
}

export function updateRing(id, { name, type, goal, color }) {
    return request(`/rings/${id}`, { method: 'PUT', body: JSON.stringify({ name, type, goal, color }) });
}

export function deleteRing(id) {
    return request(`/rings/${id}`, { method: 'DELETE' });
}

// ---------- tasks ----------

export function getTasks() {
    return request('/tasks');
}

export function createTask({ ringId, name, amount, quadrant }) {
    return request('/tasks', { method: 'POST', body: JSON.stringify({ ringId, name, amount, quadrant }) });
}

export function updateTask(id, { ringId, name, amount, quadrant }) {
    return request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ ringId, name, amount, quadrant }) });
}

export function toggleTask(id, { done, ringId, amount }) {
    return request(`/tasks/${id}/toggle`, { method: 'POST', body: JSON.stringify({ done, ringId, amount }) });
}

export function deleteTask(id) {
    return request(`/tasks/${id}`, { method: 'DELETE' });
}