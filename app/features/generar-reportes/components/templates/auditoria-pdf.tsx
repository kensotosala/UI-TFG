import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { AuditoriaCambios } from "@/app/features/auditoria/types";

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
    marginBottom: 24,
    paddingBottom: 14,
    borderBottom: "2 solid #1E3A5F",
  },
  companyName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1E3A5F",
  },
  reportTitle: {
    fontSize: 12,
    color: "#5A7A9F",
    marginTop: 4,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerDate: {
    fontSize: 10,
    color: "#888",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1E3A5F",
    padding: 6,
  },
  tableHeaderCell: {
    color: "#FFF",
    fontSize: 9,
    flex: 1,
    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "0.5 solid #E8EEF4",
  },
  tableRowEven: {
    backgroundColor: "#F5F8FC",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    textAlign: "center",
  },

  summaryBox: {
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F0F4F9",
    padding: 10,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#666",
  },
});

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
}

interface AuditoriaPDFProps {
  logs: AuditoriaCambios[];
}

export const AuditoriaPDF = ({ logs }: AuditoriaPDFProps) => {
  const today = new Date().toLocaleDateString();

  // 🔥 resumen útil
  const total = logs.length;

  const tablasUnicas = new Set(logs.map((l) => l.tablaAfectada)).size;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Auditoría del Sistema
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generado: {today}</Text>
          </View>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{total}</Text>
            <Text style={styles.summaryLabel}>Registros</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{tablasUnicas}</Text>
            <Text style={styles.summaryLabel}>Tablas Afectadas</Text>
          </View>
        </View>

        {/* TABLA */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>ID</Text>
            <Text style={styles.tableHeaderCell}>Tabla</Text>
            <Text style={styles.tableHeaderCell}>Descripción</Text>
            <Text style={styles.tableHeaderCell}>Usuario</Text>
            <Text style={styles.tableHeaderCell}>Fecha</Text>
          </View>

          {logs.map((log, i) => (
            <View
              key={log.idAuditoria}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
            >
              <Text style={styles.tableCell}>{log.idAuditoria}</Text>
              <Text style={styles.tableCell}>{log.tablaAfectada}</Text>
              <Text style={styles.tableCell}>{log.descripcion}</Text>
              <Text style={styles.tableCell}>{log.usuarioId ?? "-"}</Text>
              <Text style={styles.tableCell}>
                {formatDate(log.fechaCreacion)}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
