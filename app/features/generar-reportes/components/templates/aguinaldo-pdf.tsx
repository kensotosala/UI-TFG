import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { AguinaldoDTO } from "@/app/features/aguinaldos/types";

// FIX #1: Registrar fuente con soporte para ₡ (U+20A1)
// Roboto cubre el bloque "Currency Symbols" completo.
// Descarga los archivos o usa una URL pública confiable.
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    paddingBottom: 60,
    fontSize: 11,
    fontFamily: "Roboto", // FIX #1: fuente con soporte Unicode
  },

  // ── Header ──────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 14,
    borderBottom: "2 solid #1D4ED8",
  },
  headerLeft: { flexDirection: "column" },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
    letterSpacing: 1,
  },
  reportTitle: {
    fontSize: 12,
    color: "#2563EB",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  headerDate: { fontSize: 10, color: "#888" },
  headerBadge: {
    marginTop: 4,
    backgroundColor: "#1D4ED8",
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
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    borderLeft: "3 solid #1D4ED8",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#2563EB",
    marginTop: 3,
    textTransform: "uppercase",
  },

  // ── Tabla ────────────────────────────────────────────
  tableContainer: { marginTop: 4 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1D4ED8",
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  tableHeaderCell: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottom: "0.5 solid #DBEAFE",
  },
  tableRowEven: { backgroundColor: "#EFF6FF" },
  tableCell: {
    fontSize: 8,
    color: "#333",
    textAlign: "center",
  },

  // Anchos de columna — 5 columnas que suman flex total consistente
  colEmpleado: { flex: 2.2 },
  colDias: { flex: 0.7 },
  colSalario: { flex: 1.3 },
  colMonto: { flex: 1.3 },
  colFechaPago: { flex: 1.2 },

  // Badges estado
  estadoBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  estadoPendiente: { backgroundColor: "#FEF3C7", color: "#92400E" },
  estadoPagado: { backgroundColor: "#D1FAE5", color: "#065F46" },
  estadoAnulado: { backgroundColor: "#FEE2E2", color: "#991B1B" },

  // ── Footer ────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E3A8A",
    paddingVertical: 10,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 9, color: "#93C5FD" },
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

function formatMoney(amount: number): string {
  const [intPart, decPart] = amount.toFixed(2).split(".");
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${intFormatted},${decPart}`;
}

// ── Componente ────────────────────────────────────────

interface AguinaldosPDFProps {
  aguinaldos: AguinaldoDTO[];
  anio?: number;
}

export const AguinaldosPDF = ({ aguinaldos, anio }: AguinaldosPDFProps) => {
  const today = new Date().toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const anioReporte =
    anio ??
    (aguinaldos.length > 0
      ? new Date(aguinaldos[0].fechaCalculo).getFullYear()
      : new Date().getFullYear());

  const totalGeneral = aguinaldos
    .filter((a) => a.estado !== "ANULADO")
    .reduce((sum, a) => sum + a.montoAguinaldo, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Aguinaldos — Año {anioReporte}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generado: {today}</Text>
            <Text style={styles.headerBadge}>CONFIDENCIAL</Text>
          </View>
        </View>

        {/* ── TABLA ── */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colEmpleado]}>
              Empleado
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colDias]}>Días</Text>
            <Text style={[styles.tableHeaderCell, styles.colSalario]}>
              Sal. Promedio
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colMonto]}>Monto</Text>
            <Text style={[styles.tableHeaderCell, styles.colFechaPago]}>
              Fecha
            </Text>
          </View>

          {aguinaldos.map((a, i) => (
            <View
              key={a.idAguinaldo}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
              wrap={false}
            >
              <Text style={[styles.tableCell, styles.colEmpleado]}>
                {a.nombreEmpleado ?? "-"}
              </Text>
              <Text style={[styles.tableCell, styles.colDias]}>
                {a.diasTrabajados}
              </Text>
              <Text style={[styles.tableCell, styles.colSalario]}>
                {formatMoney(a.salarioPromedio)}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colMonto,
                  { fontWeight: "bold" },
                ]}
              >
                {formatMoney(a.montoAguinaldo)}
              </Text>
              <Text style={[styles.tableCell, styles.colFechaPago]}>
                {formatDate(a.fechaPago)}
              </Text>
            </View>
          ))}

          {/* FIX #2 y #4: fila de totales con exactamente las mismas 5 columnas
              que el header, usando colEmpleado como separador inicial */}
          <View
            style={[
              styles.tableRow,
              { borderTop: "1.5 solid #1D4ED8", marginTop: 4 },
            ]}
          >
            <Text
              style={[
                styles.tableCell,
                styles.colEmpleado,
                { fontWeight: "bold", color: "#1E3A8A", textAlign: "right" },
              ]}
            >
              TOTAL NÓMINA
            </Text>
            <Text style={[styles.tableCell, styles.colDias]} />
            <Text style={[styles.tableCell, styles.colSalario]} />
            <Text
              style={[
                styles.tableCell,
                styles.colMonto,
                { fontWeight: "bold", color: "#1E3A8A", textAlign: "right" },
              ]}
            >
              {formatMoney(totalGeneral)}
            </Text>
            <Text style={[styles.tableCell, styles.colFechaPago]} />
          </View>
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
