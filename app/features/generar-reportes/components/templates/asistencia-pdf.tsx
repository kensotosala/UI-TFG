import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { AsistenciaDetallada } from "@/app/features/asistencia/types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },

  // ── Header ──────────────────────────────────────────
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

  // ── Tabla ────────────────────────────────────────────
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

  // ── Summary ──────────────────────────────────────────
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

  // ── Footer ────────────────────────────────────────────
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

// Formatea fecha legible
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

interface AsistenciaPDFProps {
  asistencias: AsistenciaDetallada[];
  nombreEmpleado?: string;
}

export const AsistenciaPDF = ({
  asistencias,
  nombreEmpleado = "Empleado",
}: AsistenciaPDFProps) => {
  const today = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const total = asistencias.length;
  const presentes = asistencias.filter((a) => a.estado === "PRESENTE").length;
  const ausentes = asistencias.filter((a) => a.estado === "AUSENTE").length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Asistencias — {nombreEmpleado}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generado: {today}</Text>
            <Text style={styles.headerBadge}>OFICIAL</Text>
          </View>
        </View>

        {/* ── TARJETAS RESUMEN ── */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{total}</Text>
            <Text style={styles.summaryLabel}>Total Registros</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{presentes}</Text>
            <Text style={styles.summaryLabel}>Presentes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{ausentes}</Text>
            <Text style={styles.summaryLabel}>Ausentes</Text>
          </View>
        </View>

        {/* ── TABLA ── */}
        <View style={styles.tableContainer}>
          {/* Encabezados */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Fecha</Text>
            <Text style={styles.tableHeaderCell}>Entrada</Text>
            <Text style={styles.tableHeaderCell}>Salida</Text>
            <Text style={styles.tableHeaderCell}>Estado</Text>
            <Text style={styles.tableHeaderCell}>Observación</Text>
          </View>

          {/* Filas */}
          {asistencias.map((a, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
            >
              <Text style={styles.tableCell}>{formatDate(a.fecha)}</Text>
              <Text style={styles.tableCell}>{a.horaEntrada ?? "-"}</Text>
              <Text style={styles.tableCell}>{a.horaSalida ?? "-"}</Text>
              <Text style={styles.tableCell}>{a.estado ?? "-"}</Text>
              <Text style={styles.tableCell}>{a.observaciones ?? "-"}</Text>
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
