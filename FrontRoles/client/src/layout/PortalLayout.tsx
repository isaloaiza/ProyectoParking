import React from "react";
import { useAuth } from "../Autenticacion/AutProvider";
import { Link } from "react-router-dom";
import { API_URL } from "../Autenticacion/constanst";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const user = auth.getUser();

  async function handleSignOut(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getRefreshToken()}`
        }
      });

      if (response.ok) {
        auth.signOut();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  // Obtener el rol del usuario desde el contexto de autenticación
  const userRole = user?.role;

  return (
    <>
      <header className="principal">
        <div className="container-pri">
          <Link to="/" className="inicio">
            Parking<span className="span">Location.</span>{" "}
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/Perfil">Perfil</Link>
            </li>
            {userRole === "cliente" && (
              <li>
                <Link to="/Posts">Creacion parqueadero</Link>
              </li>
            )}
            {userRole === "usuario" && (
              <li>
                <Link to="/Dashboard">Mapa navegacion</Link>
              </li>
            )}
            <li>
              <a href="/" onClick={handleSignOut}>
                Salir
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
