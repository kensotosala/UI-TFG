import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { LiquidacionDTO } from "@/app/features/liquidaciones/types";

// Fuente consistente
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

  // TABLA
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

  // columnas (IMPORTANTÍSIMO: mismo orden que filas)
  colEmpleado: { flex: 1.5 },
  colPreaviso: { flex: 1 },
  colVacaciones: { flex: 1 },
  colAguinaldo: { flex: 1 },
  colCesantia: { flex: 1 },
  colTotal: { flex: 1 },
  colFecha: { flex: 1.2 },

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

// Helpers
function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-CR");
}

function formatMoney(amount?: number) {
  if (amount == null) return "-";
  return "₡" + amount.toLocaleString("es-CR");
}

interface Props {
  liquidaciones: LiquidacionDTO[];
  nombreEmpleado?: string;
  isAdmin: boolean;
}

export const LiquidacionesPDF = ({
  liquidaciones,
  nombreEmpleado = "Empleado",
  isAdmin,
}: Props) => {
  const today = new Date().toLocaleDateString("es-CR");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>All Sport Nutrition</Text>
            <Text style={styles.reportTitle}>
              Reporte de Liquidaciones — {nombreEmpleado}
            </Text>
          </View>

          <Text style={styles.headerDate}>Generado: {today}</Text>
        </View>

        {/* TABLA */}
        <View>
          {/* HEADERS */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colEmpleado]}>
              Empleado
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colPreaviso]}>
              Preaviso
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colVacaciones]}>
              Vacaciones
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colAguinaldo]}>
              Aguinaldo
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colCesantia]}>
              Cesantía
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
            <Text style={[styles.tableHeaderCell, styles.colFecha]}>Fecha</Text>
          </View>

          {/* FILAS */}
          {liquidaciones.map((obj, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : {}]}
            >
              <Text style={[styles.tableCell, styles.colEmpleado]}>
                {isAdmin ? obj.idEmpleado : nombreEmpleado}
              </Text>

              <Text style={[styles.tableCell, styles.colPreaviso]}>
                {formatMoney(obj.montoPreaviso)}
              </Text>

              <Text style={[styles.tableCell, styles.colVacaciones]}>
                {formatMoney(obj.montoVacaciones)}
              </Text>

              <Text style={[styles.tableCell, styles.colAguinaldo]}>
                {formatMoney(obj.montoAguinaldo)}
              </Text>

              <Text style={[styles.tableCell, styles.colCesantia]}>
                {formatMoney(obj.montoCesantia)}
              </Text>

              <Text style={[styles.tableCell, styles.colTotal]}>
                {formatMoney(obj.montoTotal)}
              </Text>

              <Text style={[styles.tableCell, styles.colFecha]}>
                {formatDate(obj.fechaLiquidacion)}
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
