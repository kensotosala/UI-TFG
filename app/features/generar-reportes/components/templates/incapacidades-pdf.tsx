import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {
  EstadoIncapacidad,
  TipoIncapacidad,
} from "@/app/features/incapacidades/types";
import { Incapacidad } from "@/app/features/VistaEmpleado/incapacidades-empleado/types";

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
    borderBottom: "2 solid #B45309",
  },
  headerLeft: { flexDirection: "column" },
  companyName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#78350F",
    letterSpacing: 1,
  },
  reportTitle: {
    fontSize: 12,
    color: "#B45309",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  headerDate: { fontSize: 10, color: "#888" },
  headerBadge: {
    marginTop: 4,
    backgroundColor: "#B45309",
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
    backgroundColor: "#FFFBEB",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    borderLeft: "3 solid #B45309",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#78350F",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#B45309",
    marginTop: 3,
    textTransform: "uppercase",
  },

  // ── Tabla ────────────────────────────────────────────
  tableContainer: { marginTop: 4 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#B45309",
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
    borderBottom: "0.5 solid #FDE68A",
  },
  tableRowEven: { backgroundColor: "#FFFBEB" },
  tableCell: {
    fontSize: 8,
    color: "#333",
    textAlign: "center",
  },

  // Anchos de columna
  colDiagnostico: { flex: 2.4 },
  colInicio: { flex: 1.1 },
  colFin: { flex: 1.1 },
  colTipo: { flex: 1.2 },
  colDias: { flex: 0.7 },
  colEstado: { flex: 1 },

  // Badges estado
  estadoBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  estadoActiva: { backgroundColor: "#FEF3C7", color: "#92400E" },
  estadoFinalizada: { backgroundColor: "#D1FAE5", color: "#065F46" },

  // Badges tipo
  tipoBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  tipoEnfermedad: { backgroundColor: "#FEE2E2", color: "#991B1B" },
  tipoAccidente: { backgroundColor: "#FEF3C7", color: "#92400E" },
  tipoMaternidad: { backgroundColor: "#FCE7F3", color: "#9D174D" },
  tipoPaternidad: { backgroundColor: "#DBEAFE", color: "#1E40AF" },

  // ── Footer ────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#78350F",
    paddingVertical: 10,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 9, color: "#FCD34D" },
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

function calcularDias(inicio: string, fin: string): number {
  try {
    const diff = new Date(fin).getTime() - new Date(inicio).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    return 0;
  }
}

function getEstadoStyle(estado: EstadoIncapacidad) {
  return estado === "FINALIZADA"
    ? styles.estadoFinalizada
    : styles.estadoActiva;
}

function getTipoStyle(tipo: TipoIncapacidad) {
  switch (tipo) {
    case "ENFERMEDAD":
      return styles.tipoEnfermedad;
    case "ACCIDENTE":
      return styles.tipoAccidente;
    case "MATERNIDAD":
      return styles.tipoMaternidad;
    case "PATERNIDAD":
      return styles.tipoPaternidad;
    default:
      return styles.tipoEnfermedad;
  }
}

// ── Componente ────────────────────────────────────────

interface IncapacidadesPDFProps {
  incapacidades: Incapacidad[];
  nombreEmpleado?: string;
}

export const IncapacidadesPDF = ({
  incapacidades,
  nombreEmpleado = "Empleado",
}: IncapacidadesPDFProps) => {
  const today = new Date().toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const total = incapacidades.length;
  const activas = incapacidades.filter((i) => i.estado === "ACTIVA").length;
  const finalizadas = incapacidades.filter(
    (i) => i.estado === "FINALIZADA",
  ).length;
  const totalDias = incapacidades.reduce(
    (sum, i) => sum + calcularDias(i.fechaInicio, i.fechaFin),
    0,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Incapacidades — {nombreEmpleado}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generado: {today}</Text>
            <Text style={styles.headerBadge}>MÉDICO</Text>
          </View>
        </View>

        {/* ── RESUMEN ── */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{total}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{activas}</Text>
            <Text style={styles.summaryLabel}>Activas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{finalizadas}</Text>
            <Text style={styles.summaryLabel}>Finalizadas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalDias}</Text>
            <Text style={styles.summaryLabel}>Días Total</Text>
          </View>
        </View>

        {/* ── TABLA ── */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDiagnostico]}>
              Diagnóstico
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colInicio]}>
              F. Inicio
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colFin]}>F. Fin</Text>
            <Text style={[styles.tableHeaderCell, styles.colTipo]}>Tipo</Text>
            <Text style={[styles.tableHeaderCell, styles.colDias]}>Días</Text>
            <Text style={[styles.tableHeaderCell, styles.colEstado]}>
              Estado
            </Text>
          </View>

          {incapacidades.map((inc, i) => (
            <View
              key={inc.idIncapacidad}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
              wrap={false}
            >
              <Text style={[styles.tableCell, styles.colDiagnostico]}>
                {inc.diagnostico}
              </Text>
              <Text style={[styles.tableCell, styles.colInicio]}>
                {formatDate(inc.fechaInicio)}
              </Text>
              <Text style={[styles.tableCell, styles.colFin]}>
                {formatDate(inc.fechaFin)}
              </Text>
              <View style={[styles.colTipo, { alignItems: "center" }]}>
                <Text
                  style={[styles.tipoBadge, getTipoStyle(inc.tipoIncapacidad)]}
                >
                  {inc.tipoIncapacidad}
                </Text>
              </View>
              <Text style={[styles.tableCell, styles.colDias]}>
                {calcularDias(inc.fechaInicio, inc.fechaFin)}
              </Text>
              <View style={[styles.colEstado, { alignItems: "center" }]}>
                <Text style={[styles.estadoBadge, getEstadoStyle(inc.estado)]}>
                  {inc.estado}
                </Text>
              </View>
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
