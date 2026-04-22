// app/features/generar-reportes/components/templates/horas-extra-pdf.tsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { HoraExtra } from "@/app/features/horas-extra/types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 14,
    borderBottom: "2 solid #1E3A5F",
  },
  headerLeft: {
    flexDirection: "column",
  },
  companyName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1E3A5F",
    letterSpacing: 1,
  },
  reportTitle: {
    fontSize: 12,
    color: "#5A7A9F",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  headerDate: {
    fontSize: 10,
    color: "#888",
  },
  headerBadge: {
    marginTop: 4,
    backgroundColor: "#1E3A5F",
    color: "#FFFFFF",
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tableContainer: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1E3A5F",
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  tableHeaderCell: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottom: "0.5 solid #E8EEF4",
  },
  tableRowEven: {
    backgroundColor: "#F5F8FC",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: "#333",
    textAlign: "center",
  },
  summaryBox: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F0F4F9",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1E3A5F",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#5A7A9F",
    marginTop: 2,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E3A5F",
    paddingVertical: 10,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#A0B4C8",
  },
  footerPage: {
    fontSize: 9,
    color: "#FFFFFF",
  },
});

// Formato de hora a 12h (reutiliza la misma lógica)
function formatTime(timeStr?: string | null): string {
  if (!timeStr) return "-";
  const parts = timeStr.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || "00";
  if (isNaN(hours)) return "-";
  const period = hours >= 12 ? "pm" : "am";
  let hour12 = hours % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${minutes.padStart(2, "0")} ${period}`;
}

// Formato de fecha legible
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr ?? "-";
  }
}

// Formatear minutos a horas y minutos (para horasTotales)
function formatMinutos(minutos?: number): string {
  if (minutos == null) return "-";
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
}

interface HorasExtraPDFProps {
  horasExtras: HoraExtra[];
  nombreEmpleado?: string;
  isAdmin: boolean;
}

export const HorasExtraPDF = ({
  horasExtras,
  nombreEmpleado = "Empleado",
  isAdmin,
}: HorasExtraPDFProps) => {
  const today = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const total = horasExtras.length;
  const aprobadas = horasExtras.filter(
    (h) => h.estadoSolicitud === "APROBADA",
  ).length;
  const pendientes = horasExtras.filter(
    (h) => h.estadoSolicitud === "PENDIENTE",
  ).length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Horas Extra — {nombreEmpleado}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generado: {today}</Text>
            <Text style={styles.headerBadge}>OFICIAL</Text>
          </View>
        </View>

        {/* Tarjetas resumen */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{total}</Text>
            <Text style={styles.summaryLabel}>Total Solicitudes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{aprobadas}</Text>
            <Text style={styles.summaryLabel}>Aprobadas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{pendientes}</Text>
            <Text style={styles.summaryLabel}>Pendientes</Text>
          </View>
        </View>

        {/* Tabla */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            {isAdmin && <Text style={styles.tableHeaderCell}>Empleado</Text>}
            <Text style={styles.tableHeaderCell}>Fecha Inicio</Text>
            <Text style={styles.tableHeaderCell}>Hora Inicio</Text>
            <Text style={styles.tableHeaderCell}>Fecha Fin</Text>
            <Text style={styles.tableHeaderCell}>Hora Fin</Text>
            <Text style={styles.tableHeaderCell}>Horas Totales</Text>
            <Text style={styles.tableHeaderCell}>Estado</Text>
          </View>

          {horasExtras.map((h, i) => {
            const fechaInicio = h.fechaInicio.split("T")[0];
            const horaInicio = h.fechaInicio.split("T")[1]?.split(".")[0];
            const fechaFin = h.fechaFin.split("T")[0];
            const horaFin = h.fechaFin.split("T")[1]?.split(".")[0];

            return (
              <View
                key={h.idHoraExtra}
                style={[
                  styles.tableRow,
                  i % 2 === 0 ? styles.tableRowEven : {},
                ]}
              >
                {isAdmin && (
                  <Text style={styles.tableCell}>
                    {h.nombreEmpleado || h.codigoEmpleado || "-"}
                  </Text>
                )}
                <Text style={styles.tableCell}>{formatDate(fechaInicio)}</Text>
                <Text style={styles.tableCell}>{formatTime(horaInicio)}</Text>
                <Text style={styles.tableCell}>{formatDate(fechaFin)}</Text>
                <Text style={styles.tableCell}>{formatTime(horaFin)}</Text>
                <Text style={styles.tableCell}>
                  {formatMinutos(h.horasTotales)}
                </Text>
                <Text style={styles.tableCell}>{h.estadoSolicitud}</Text>
              </View>
            );
          })}
        </View>

        {/* Footer */}
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
