"use client";

export default function EmpleadoDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Mi Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/empleado/asistencias"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Asistencias</h2>
          <p className="text-muted-foreground">Ver mis asistencias</p>
        </a>
        <a
          href="/empleado/permisos"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Permisos</h2>
          <p className="text-muted-foreground">Solicitar permisos</p>
        </a>
        <a
          href="/empleado/vacaciones"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Vacaciones</h2>
          <p className="text-muted-foreground">Ver mis vacaciones</p>
        </a>
      </div>
    </div>
  );
}
