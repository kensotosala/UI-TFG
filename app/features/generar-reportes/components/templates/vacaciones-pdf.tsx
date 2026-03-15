import { ListarVacacionesDTO } from "@/app/features/vacaciones/vacaciones.types";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

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
    fontFamily: "Roboto",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: "#1D4ED8",
    borderBottomStyle: "solid",
  },
  headerLeft: { flexDirection: "column" },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
    letterSpacing: 1,
  },
  reportTitle: { fontSize: 12, color: "#2563EB", marginTop: 4 },
  headerRight: { flexDirection: "column", alignItems: "flex-end" },
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
    borderBottomWidth: 0.5,
    borderBottomColor: "#DBEAFE",
    borderBottomStyle: "solid",
  },
  tableRowEven: { backgroundColor: "#EFF6FF" },
  tableCell: { fontSize: 8, color: "#333", textAlign: "center" },

  colEmpleado: { flex: 2.2 },
  colFecha: { flex: 1.2 },
  colDias: { flex: 0.7 },
  colEstado: { flex: 1.3 },

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

// Helper
function formatDate(dateStr?: string | null) {
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

export interface VacacionesPDFProps {
  vacaciones: ListarVacacionesDTO[];
  empleado?: string;
}

export const VacacionesPDF = ({ vacaciones, empleado }: VacacionesPDFProps) => {
  const today = new Date().toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const anioReporte = new Date().getFullYear();

  const calcularDias = (inicio: string, fin: string) => {
    try {
      const diff = new Date(fin).getTime() - new Date(inicio).getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    } catch {
      return 0;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Vacaciones — Año {anioReporte}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>Generado: {today}</Text>
            <Text style={styles.headerBadge}>CONFIDENCIAL</Text>
          </View>
        </View>

        {/* Tabla */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colEmpleado]}>
              Empleado
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colFecha]}>
              Fecha Inicio
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colFecha]}>
              Fecha Fin
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colDias]}>Días</Text>
            <Text style={[styles.tableHeaderCell, styles.colEstado]}>
              Estado
            </Text>
          </View>

          {vacaciones.map((v, i) => (
            <View
              key={v.idVacacion}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
              wrap={false}
            >
              <Text style={[styles.tableCell, styles.colEmpleado]}>
                {empleado ?? "-"}
              </Text>
              <Text style={[styles.tableCell, styles.colFecha]}>
                {formatDate(v.fechaInicio)}
              </Text>
              <Text style={[styles.tableCell, styles.colFecha]}>
                {formatDate(v.fechaFin)}
              </Text>
              <Text style={[styles.tableCell, styles.colDias]}>
                {calcularDias(v.fechaInicio, v.fechaFin)}
              </Text>
              <Text style={[styles.tableCell, styles.colEstado]}>
                {v.estadoSolicitud}
              </Text>
            </View>
          ))}
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
