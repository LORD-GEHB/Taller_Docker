"use client";

import { useState, useEffect } from 'react';

interface User {
  nombre: string;
  edad: number;
  correo: string;
  carnet: string;
}

export default function Home() {
  const API_URL = 'http://localhost:3001';
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('crear');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Formulario para crear usuario
  const [newUser, setNewUser] = useState({
    nombre: '',
    edad: '',
    correo: '',
    carnet: ''
  });

  // Cargar usuarios del backend al inicializar
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) throw new Error('Error al cargar usuarios');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        showAlert('error', 'Error al conectar con el servidor');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Mostrar alerta temporal
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Validar email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Crear usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.nombre || !newUser.edad || !newUser.correo || !newUser.carnet) {
      showAlert('error', 'Todos los campos son obligatorios');
      return;
    }

    if (!isValidEmail(newUser.correo)) {
      showAlert('error', 'Por favor ingresa un correo válido');
      return;
    }

    if (parseInt(newUser.edad) <= 0 || parseInt(newUser.edad) > 120) {
      showAlert('error', 'La edad debe ser un número válido entre 1 y 120');
      return;
    }

    // Verificar si el correo o carnet ya existen
    const existingUser = users.find(user => 
      user.correo === newUser.correo || user.carnet === newUser.carnet
    );

    if (existingUser) {
      showAlert('error', 'Ya existe un usuario con ese correo o carnet');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newUser.nombre.trim(),
          edad: parseInt(newUser.edad),
          correo: newUser.correo.toLowerCase().trim(),
          carnet: newUser.carnet.trim(),
        }),
      });
      if (!response.ok) throw new Error('Error al crear usuario');
      // Refetch users to stay in sync
      const usersResponse = await fetch(`${API_URL}/usuarios`);
      if (!usersResponse.ok) throw new Error('Error al recargar usuarios');
      setUsers(await usersResponse.json());
      setNewUser({ nombre: '', edad: '', correo: '', carnet: '' });
      showAlert('success', 'Usuario creado exitosamente');
    } catch (error) {
      showAlert('error', 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar usuario
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;

    if (!editingUser.nombre || !editingUser.edad || !editingUser.correo || !editingUser.carnet) {
      showAlert('error', 'Todos los campos son obligatorios');
      return;
    }

    if (!isValidEmail(editingUser.correo)) {
      showAlert('error', 'Por favor ingresa un correo válido');
      return;
    }

    if (editingUser.edad <= 0 || editingUser.edad > 120) {
      showAlert('error', 'La edad debe ser un número válido entre 1 y 120');
      return;
    }

    // Verificar si el correo o carnet ya existen en otros usuarios
    const existingUser = users.find(user => 
      user.carnet !== editingUser.carnet && 
      (user.correo === editingUser.correo || user.carnet === editingUser.carnet)
    );

    if (existingUser) {
      showAlert('error', 'Ya existe otro usuario con ese correo o carnet');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/usuario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editingUser.nombre.trim(),
          edad: editingUser.edad,
          correo: editingUser.correo.toLowerCase().trim(),
          carnet: editingUser.carnet.trim(),
        }),
      });
      if (!response.ok) throw new Error('Error al actualizar usuario');
      // Refetch users to stay in sync
      const usersResponse = await fetch(`${API_URL}/usuarios`);
      if (!usersResponse.ok) throw new Error('Error al recargar usuarios');
      setUsers(await usersResponse.json());
      setEditingUser(null);
      setActiveTab('listar');
      showAlert('success', 'Usuario actualizado exitosamente');
    } catch (error) {
      showAlert('error', 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (carnet: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/usuario`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carnet }),
      });
      if (!response.ok) throw new Error('Error al eliminar usuario');
      // Refetch users to stay in sync
      const usersResponse = await fetch(`${API_URL}/usuarios`);
      if (!usersResponse.ok) throw new Error('Error al recargar usuarios');
      setUsers(await usersResponse.json());
      setShowDeleteConfirm(null);
      showAlert('success', 'Usuario eliminado exitosamente');
    } catch (error) {
      showAlert('error', 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Gestión de Usuarios</h1>
          <p className="text-gray-600 text-lg">Administra usuarios con operaciones CRUD completas</p>
        </div>

        {/* Alertas */}
        {alertMessage && (
          <div className={`mb-6 p-4 rounded-lg border ${
            alertMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {alertMessage.message}
          </div>
        )}

        {/* Indicador de carga */}
        {isLoading && (
          <div className="text-center mb-4">
            <p className="text-gray-600">Cargando...</p>
          </div>
        )}

        {/* Sistema de Pestañas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'crear', label: 'Crear Usuario', icon: '➕' },
              { id: 'listar', label: 'Listar Usuarios', icon: '👥' },
              { id: 'actualizar', label: 'Actualizar Usuario', icon: '✏️' },
              { id: 'eliminar', label: 'Eliminar Usuario', icon: '🗑️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Crear Usuario */}
            {activeTab === 'crear' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Nuevo Usuario</h2>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        value={newUser.nombre}
                        onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Edad
                      </label>
                      <input
                        type="number"
                        placeholder="Ej: 25"
                        value={newUser.edad}
                        onChange={(e) => setNewUser({...newUser, edad: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        min="1"
                        max="120"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="Ej: juan@email.com"
                        value={newUser.correo}
                        onChange={(e) => setNewUser({...newUser, correo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Carnet/Cédula
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 12345678"
                        value={newUser.carnet}
                        onChange={(e) => setNewUser({...newUser, carnet: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-gray-400"
                  >
                    ➕ Crear Usuario
                  </button>
                </form>
              </div>
            )}

            {/* Listar Usuarios */}
            {activeTab === 'listar' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Lista de Usuarios</h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {users.length} usuarios
                  </span>
                </div>
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No hay usuarios registrados</h3>
                    <p className="text-gray-400 mb-4">Comienza creando tu primer usuario</p>
                    <button
                      onClick={() => setActiveTab('crear')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      ➕ Crear Usuario
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                      <div key={user.carnet} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg text-gray-800">{user.nombre}</h3>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Activo
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p><span className="font-medium">Edad:</span> {user.edad} años</p>
                          <p><span className="font-medium">Email:</span> {user.correo}</p>
                          <p><span className="font-medium">Carnet:</span> {user.carnet}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setActiveTab('actualizar');
                            }}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-md hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(user.carnet)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-md hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actualizar Usuario */}
            {activeTab === 'actualizar' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Actualizar Usuario</h2>
                {!editingUser ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✏️</div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No hay usuario seleccionado</h3>
                    <p className="text-gray-400 mb-4">Ve a la lista de usuarios y selecciona "Editar"</p>
                    <button
                      onClick={() => setActiveTab('listar')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      👥 Ver Usuarios
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-blue-800 text-sm">
                        <span className="font-medium">Editando:</span> {editingUser.nombre}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={editingUser.nombre}
                          onChange={(e) => setEditingUser({...editingUser, nombre: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Edad
                        </label>
                        <input
                          type="number"
                          value={editingUser.edad.toString()}
                          onChange={(e) => setEditingUser({...editingUser, edad: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          min="1"
                          max="120"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correo electrónico
                        </label>
                        <input
                          type="email"
                          value={editingUser.correo}
                          onChange={(e) => setEditingUser({...editingUser, correo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Carnet/Cédula
                        </label>
                        <input
                          type="text"
                          value={editingUser.carnet}
                          onChange={(e) => setEditingUser({...editingUser, carnet: e.target.value})}
                          className="w-full px-3 py ProxyStateAgent -2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-gray-400"
                      >
                        ✏️ Actualizar Usuario
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setActiveTab('listar');
                        }}
                        className="px-6 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Eliminar Usuario */}
            {activeTab === 'eliminar' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Eliminar Usuario</h2>
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🗑️</div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No hay usuarios para eliminar</h3>
                    <p className="text-gray-400 mb-4">Primero debes crear algunos usuarios</p>
                    <button
                      onClick={() => setActiveTab('crear')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      ➕ Crear Usuario
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 text-red-800 mb-1">
                        <span className="text-lg">⚠️</span>
                        <span className="font-medium">Advertencia</span>
                      </div>
                      <p className="text-red-700 text-sm">
                        La eliminación de usuarios es permanente y no se puede deshacer.
                      </p>
                    </div>
                    {users.map((user) => (
                      <div key={user.carnet} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                              👤
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{user.nombre}</h3>
                              <div className="text-sm text-gray-600">
                                {user.correo} • {user.carnet}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(user.carnet)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Eliminar usuario?</h3>
              <p className="text-gray-600 mb-4">
                Estás a punto de eliminar permanentemente el usuario{' '}
                <strong>{users.find(u => u.carnet === showDeleteConfirm)?.nombre}</strong>.
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-400"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}