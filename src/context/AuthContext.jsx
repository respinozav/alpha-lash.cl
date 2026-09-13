import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Estado de Cliente (Google OAuth 2.0)
  const [clientUser, setClientUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alpha_client_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Estado de Administrador
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alpha_admin_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Guardar en localStorage
  useEffect(() => {
    if (clientUser) {
      localStorage.setItem('alpha_client_auth', JSON.stringify(clientUser));
    } else {
      localStorage.removeItem('alpha_client_auth');
    }
  }, [clientUser]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('alpha_admin_auth', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('alpha_admin_auth');
    }
  }, [adminUser]);

  // Login de Cliente con Google OAuth
  const loginGoogle = async (googleProfile) => {
    // googleProfile: { google_id, nombre, correo, celular, direccion, picture }
    try {
      const dbClient = await api.syncClienteGoogle(googleProfile);
      setClientUser({ ...googleProfile, ...dbClient });
      return { success: true, user: { ...googleProfile, ...dbClient } };
    } catch (err) {
      console.error('Error al sincronizar cliente Google:', err);
      // Mantener sesión de cliente local si la API falla
      setClientUser(googleProfile);
      return { success: true, user: googleProfile };
    }
  };

  const logoutClient = () => {
    setClientUser(null);
  };

  const updateClientData = async (data) => {
    if (!clientUser) return;
    const updated = { ...clientUser, ...data };
    setClientUser(updated);
    if (clientUser.uid) {
      await api.updateCliente(clientUser.uid, data);
    }
  };

  // Login de Administrador
  const loginAdmin = async (correo, clave) => {
    // Verificar credenciales contra tabla usuarios o credencial por defecto
    const usuarios = await api.getUsuarios();
    const user = usuarios.find(
      (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.activo
    );

    // En entorno demo/desarrollo permitimos acceso con Admin2026! o si el usuario coincide
    if (user && (clave === 'Admin2026!' || clave === user.clave)) {
      const session = {
        uid: user.uid,
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        rol: user.rol,
        token: `jwt_simulado_${Date.now()}`,
      };
      setAdminUser(session);
      return { success: true, user: session };
    } else if (correo.toLowerCase() === 'admin@alpha-lash.cl' && clave === 'Admin2026!') {
      const session = {
        uid: '22222222-2222-2222-2222-222222222201',
        nombre_usuario: 'Administrador Alpha Lash',
        correo: 'admin@alpha-lash.cl',
        rol: 'admin',
        token: `jwt_simulado_${Date.now()}`,
      };
      setAdminUser(session);
      return { success: true, user: session };
    }

    return { success: false, message: 'Credenciales inválidas o usuario inactivo.' };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        clientUser,
        adminUser,
        loginGoogle,
        logoutClient,
        updateClientData,
        loginAdmin,
        logoutAdmin,
        isAdmin: !!adminUser,
        isClient: !!clientUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
