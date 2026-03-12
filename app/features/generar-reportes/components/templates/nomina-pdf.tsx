import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { NominaDTO } from "@/app/features/nominas/nomina.types";

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
    fontSize: 9,
    color: "#333",
    textAlign: "center",
  },

  colPeriodo: { flex: 1.4 },
  colFecha: { flex: 1.2 },
  colBruto: { flex: 1.2 },
  colDeducciones: { flex: 1.2 },
  colNeto: { flex: 1.2 },

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

// ── Helpers ───────────────────────────────────────────

function formatDate(dateStr?: string) {
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

function formatMoney(amount?: number) {
  if (amount == null) return "-";

  return amount.toLocaleString("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  });
}

interface NominaPDFProps {
  nominas: NominaDTO[];
  nombreEmpleado?: string;
}

export const NominaPDF = ({
  nominas,
  nombreEmpleado = "Empleado",
}: NominaPDFProps) => {
  const today = new Date().toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const totalBruto = nominas.reduce((s, n) => s + (n.totalBruto ?? 0), 0);
  const totalDeducciones = nominas.reduce(
    (s, n) => s + (n.deducciones ?? 0),
    0,
  );
  const totalNeto = nominas.reduce((s, n) => s + (n.totalNeto ?? 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Nóminas — {nombreEmpleado}
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
            <Text style={styles.summaryValue}>{nominas.length}</Text>
            <Text style={styles.summaryLabel}>Total Nóminas</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{formatMoney(totalBruto)}</Text>
            <Text style={styles.summaryLabel}>Bruto Total</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {formatMoney(totalDeducciones)}
            </Text>
            <Text style={styles.summaryLabel}>Deducciones</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{formatMoney(totalNeto)}</Text>
            <Text style={styles.summaryLabel}>Neto Total</Text>
          </View>
        </View>

        {/* ── TABLA ── */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colPeriodo]}>
              Período
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colFecha]}>
              Fecha Pago
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colBruto]}>Bruto</Text>
            <Text style={[styles.tableHeaderCell, styles.colDeducciones]}>
              Deducciones
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colNeto]}>Neto</Text>
          </View>

          {nominas.map((n, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
            >
              <Text style={[styles.tableCell, styles.colPeriodo]}>
                {n.periodoNomina ?? "-"}
              </Text>

              <Text style={[styles.tableCell, styles.colFecha]}>
                {formatDate(n.fechaPago)}
              </Text>

              <Text style={[styles.tableCell, styles.colBruto]}>
                {formatMoney(n.totalBruto)}
              </Text>

              <Text style={[styles.tableCell, styles.colDeducciones]}>
                {formatMoney(n.deducciones)}
              </Text>

              <Text style={[styles.tableCell, styles.colNeto]}>
                {formatMoney(n.totalNeto)}
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
