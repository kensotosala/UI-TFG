// permisos-pdf.tsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Permiso } from "@/app/features/permisos/types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    paddingBottom: 60,
    fontSize: 11,
    fontFamily: "Helvetica",
  },

  // ── Header ──────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 14,
    borderBottom: "2 solid #6D28D9",
  },
  headerLeft: { flexDirection: "column" },
  companyName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#3B0764",
    letterSpacing: 1,
  },
  reportTitle: {
    fontSize: 12,
    color: "#7C3AED",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  headerDate: { fontSize: 10, color: "#888" },
  headerBadge: {
    marginTop: 4,
    backgroundColor: "#6D28D9",
    color: "#FFFFFF",
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },

  // ── Resumen ──────────────────────────────────────────
  summaryBox: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    borderLeft: "3 solid #6D28D9",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#3B0764",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#7C3AED",
    marginTop: 3,
    textTransform: "uppercase",
  },

  // ── Tabla ────────────────────────────────────────────
  tableContainer: { marginTop: 4 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#6D28D9",
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  tableHeaderCell: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottom: "0.5 solid #EDE9FE",
  },
  tableRowEven: { backgroundColor: "#F5F3FF" },
  tableCell: {
    fontSize: 8,
    color: "#333",
    textAlign: "center",
  },

  // Anchos de columna
  colFechaPermiso: { flex: 1.1 },
  colFechaSolicitud: { flex: 1.1 },
  colMotivo: { flex: 2.2 },
  colGoce: { flex: 0.8 },
  colEstado: { flex: 1 },
  colAprobacion: { flex: 1.1 },

  // Badges de estado
  estadoBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  estadoPendiente: { backgroundColor: "#FEF3C7", color: "#92400E" },
  estadoAprobada: { backgroundColor: "#D1FAE5", color: "#065F46" },
  estadoRechazada: { backgroundColor: "#FEE2E2", color: "#991B1B" },

  // Badge goce
  goceSi: { backgroundColor: "#D1FAE5", color: "#065F46" },
  goceNo: { backgroundColor: "#F3F4F6", color: "#374151" },

  // ── Footer ────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#3B0764",
    paddingVertical: 10,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 9, color: "#C4B5FD" },
  footerPage: { fontSize: 9, color: "#FFFFFF" },
});

// ── Helpers ───────────────────────────────────────────

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getEstadoStyle(estado?: string | null) {
  const s = estado?.toUpperCase() ?? "";
  if (s === "APROBADA") return styles.estadoAprobada;
  if (s === "RECHAZADA") return styles.estadoRechazada;
  return styles.estadoPendiente;
}

// ── Componente ────────────────────────────────────────

interface PermisosPDFProps {
  permisos: Permiso[];
  nombreEmpleado?: string;
}

export const PermisosPDF = ({
  permisos,
  nombreEmpleado = "Empleado",
}: PermisosPDFProps) => {
  const today = new Date().toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const total = permisos.length;
  const aprobadas = permisos.filter(
    (p) => p.estadoSolicitud?.toUpperCase() === "APROBADA",
  ).length;
  const pendientes = permisos.filter(
    (p) => p.estadoSolicitud?.toUpperCase() === "PENDIENTE",
  ).length;
  const rechazadas = permisos.filter(
    (p) => p.estadoSolicitud?.toUpperCase() === "RECHAZADA",
  ).length;
  const conGoce = permisos.filter((p) => p.conGoceSalario).length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Permisos — {nombreEmpleado}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generado: {today}</Text>
            <Text style={styles.headerBadge}>OFICIAL</Text>
          </View>
        </View>

        {/* ── RESUMEN ── */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{total}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{aprobadas}</Text>
            <Text style={styles.summaryLabel}>Aprobadas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{pendientes}</Text>
            <Text style={styles.summaryLabel}>Pendientes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{rechazadas}</Text>
            <Text style={styles.summaryLabel}>Rechazadas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{conGoce}</Text>
            <Text style={styles.summaryLabel}>Con Goce</Text>
          </View>
        </View>

        {/* ── TABLA ── */}
        <View style={styles.tableContainer}>
          {/* Encabezados */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colFechaPermiso]}>
              Fecha Permiso
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colFechaSolicitud]}>
              F. Solicitud
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colMotivo]}>
              Motivo
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colGoce]}>Goce</Text>
            <Text style={[styles.tableHeaderCell, styles.colEstado]}>
              Estado
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colAprobacion]}>
              F. Aprobación
            </Text>
          </View>

          {/* Filas */}
          {permisos.map((p, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
              wrap={false}
            >
              <Text style={[styles.tableCell, styles.colFechaPermiso]}>
                {formatDate(p.fechaPermiso)}
              </Text>
              <Text style={[styles.tableCell, styles.colFechaSolicitud]}>
                {formatDate(p.fechaSolicitud)}
              </Text>
              <Text style={[styles.tableCell, styles.colMotivo]}>
                {p.motivo ?? "-"}
              </Text>
              <View style={[styles.colGoce, { alignItems: "center" }]}>
                <Text
                  style={[
                    styles.estadoBadge,
                    p.conGoceSalario ? styles.goceSi : styles.goceNo,
                  ]}
                >
                  {p.conGoceSalario ? "Sí" : "No"}
                </Text>
              </View>
              <View style={[styles.colEstado, { alignItems: "center" }]}>
                <Text
                  style={[
                    styles.estadoBadge,
                    getEstadoStyle(p.estadoSolicitud),
                  ]}
                >
                  {p.estadoSolicitud ?? "PENDIENTE"}
                </Text>
              </View>
              <Text style={[styles.tableCell, styles.colAprobacion]}>
                {formatDate(p.fechaAprobacion)}
              </Text>
            </View>
          ))}
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            All Sport Nutrition — Documento confidencial
          </Text>
          <Text
            style={styles.footerPage}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};
