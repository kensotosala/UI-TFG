import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { EvaluacionRendimientoResponse } from "@/app/features/evaluaciones-rendimiento/types";

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
    marginBottom: 20,
    paddingBottom: 14,
    borderBottom: "2 solid #1D4ED8",
  },

  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
  },

  reportTitle: {
    fontSize: 12,
    color: "#2563EB",
    marginTop: 4,
  },

  headerDate: { fontSize: 10, color: "#888" },

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
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1D4ED8",
    padding: 6,
  },

  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "0.5 solid #DBEAFE",
  },

  tableCell: {
    fontSize: 8,
    textAlign: "center",
  },

  colEmpleado: { flex: 2 },
  colEvaluador: { flex: 2 },
  colPeriodo: { flex: 2 },
  colPuntuacion: { flex: 1 },
  colEstado: { flex: 1 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E3A8A",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: { fontSize: 9, color: "#93C5FD" },
  footerPage: { fontSize: 9, color: "#FFFFFF" },
});

// Helpers

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-CR");
};

const calcularPromedio = (data: EvaluacionRendimientoResponse[]) => {
  if (!data.length) return 0;
  return data.reduce((acc, e) => acc + e.puntuacionTotal, 0) / data.length;
};

// Component

export const EvaluacionesPDF = ({
  evaluaciones,
}: {
  evaluaciones: EvaluacionRendimientoResponse[];
}) => {
  const today = new Date().toLocaleDateString("es-CR");

  const activas = evaluaciones.filter((e) => e.estado !== "ANULADA");

  const promedio = calcularPromedio(activas);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>Reporte de Evaluaciones</Text>
          </View>
          <Text style={styles.headerDate}>Generado: {today}</Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{evaluaciones.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{activas.length}</Text>
            <Text style={styles.summaryLabel}>Activas</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{promedio.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Promedio</Text>
          </View>
        </View>

        {/* TABLA */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.colEmpleado]}>Empleado</Text>
            <Text style={[styles.tableCell, styles.colEvaluador]}>
              Evaluador
            </Text>
            <Text style={[styles.tableCell, styles.colPeriodo]}>Periodo</Text>
            <Text style={[styles.tableCell, styles.colPuntuacion]}>Score</Text>
            <Text style={[styles.tableCell, styles.colEstado]}>Estado</Text>
          </View>

          {evaluaciones.map((e) => (
            <View key={e.idEvaluacion} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colEmpleado]}>
                {e.nombreEmpleado}
              </Text>
              <Text style={[styles.tableCell, styles.colEvaluador]}>
                {e.nombreEvaluador}
              </Text>
              <Text style={[styles.tableCell, styles.colPeriodo]}>
                {formatDate(e.fechaInicio)} - {formatDate(e.fechaFin)}
              </Text>
              <Text style={[styles.tableCell, styles.colPuntuacion]}>
                {e.puntuacionTotal}
              </Text>
              <Text style={[styles.tableCell, styles.colEstado]}>
                {e.estado}
              </Text>
            </View>
          ))}

          {/* TOTAL */}
          <View style={[styles.tableRow, { marginTop: 4 }]}>
            <Text style={[styles.tableCell, styles.colEmpleado]}>
              PROMEDIO GENERAL
            </Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={[styles.tableCell, styles.colPuntuacion]}>
              {promedio.toFixed(2)}
            </Text>
            <Text style={styles.tableCell}></Text>
          </View>
        </View>

        {/* FOOTER */}
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
