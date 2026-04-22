import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Empleado } from "@/app/features/empleados/types";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "2 solid #1E3A5F",
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1E3A5F",
  },
  reportTitle: {
    fontSize: 11,
    color: "#5A7A9F",
  },
  headerDate: {
    fontSize: 9,
    color: "#888",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1E3A5F",
    padding: 6,
  },
  tableHeaderCell: {
    color: "#FFF",
    fontSize: 8,
    fontWeight: 700,
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
    fontSize: 8,
    textAlign: "center",
  },
  colCodigo: { flex: 1 },
  colNombre: { flex: 2 },
  colEmail: { flex: 2 },
  colTelefono: { flex: 1.2 },
  colContrato: { flex: 1.2 },
  colEstado: { flex: 1 },
  colContratacion: { flex: 1.2 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E3A5F",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#A0B4C8",
  },
  footerPage: {
    fontSize: 8,
    color: "#FFF",
  },
});

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-CR");
}

interface Props {
  empleados: Empleado[];
}

export const EmpleadosPDF = ({ empleados }: Props) => {
  const today = new Date().toLocaleDateString("es-CR");

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>Reporte de Empleados</Text>
          </View>
          <Text style={styles.headerDate}>Generado: {today}</Text>
        </View>

        {/* TABLA */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colCodigo]}>
              Código
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colNombre]}>
              Nombre
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colEmail]}>Email</Text>
            <Text style={[styles.tableHeaderCell, styles.colTelefono]}>
              Teléfono
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colContrato]}>
              Contrato
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colEstado]}>
              Estado
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colContratacion]}>
              Contratación
            </Text>
          </View>

          {empleados.map((emp, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
            >
              <Text style={[styles.tableCell, styles.colCodigo]}>
                {emp.codigoEmpleado}
              </Text>
              <Text style={[styles.tableCell, styles.colNombre]}>
                {emp.nombre} {emp.primerApellido} {emp.segundoApellido ?? ""}
              </Text>
              <Text style={[styles.tableCell, styles.colEmail]}>
                {emp.email}
              </Text>
              <Text style={[styles.tableCell, styles.colTelefono]}>
                {emp.telefono}
              </Text>
              <Text style={[styles.tableCell, styles.colContrato]}>
                {emp.tipoContrato}
              </Text>
              <Text style={[styles.tableCell, styles.colEstado]}>
                {emp.estado ?? "ACTIVO"}
              </Text>
              <Text style={[styles.tableCell, styles.colContratacion]}>
                {formatDate(emp.fechaContratacion)}
              </Text>
            </View>
          ))}
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
