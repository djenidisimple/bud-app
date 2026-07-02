'use client'

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Pttg8zYS_SKggPN4iYQTYx0.woff2", fontWeight: "normal" },
    { src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Pttg8zYS_SKggPN4iYQTYx0.woff2", fontWeight: "bold" },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  table: {
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 4,
  },
  tableHeader: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
  },
  cellName: {
    width: "40%",
    paddingHorizontal: 4,
  },
  cellAmount: {
    width: "20%",
    textAlign: "right",
    paddingHorizontal: 4,
  },
  cellResource: {
    width: "20%",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  cellRemaining: {
    width: "20%",
    textAlign: "right",
    paddingHorizontal: 4,
  },
  totalRow: {
    flexDirection: "row",
    fontWeight: "bold",
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 2,
    borderTopColor: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#999",
    fontSize: 8,
  },
})

interface Project {
  id: number
  name_project?: string
  [key: string]: unknown
}

interface Resource {
  id: number
  price_resource: number
  origine_resource: string
  [key: string]: unknown
}

interface Spend {
  id: number
  name_spend: string
  [key: string]: unknown
}

interface Detail {
  id: number
  spend_id: number
  name_detail: string
  [key: string]: unknown
}

interface Make {
  id: number
  detail_id: number
  resource_id: number
  price_spend: number
  [key: string]: unknown
}

interface PDFPreviewProps {
  project: Project
  resources: Resource[]
  spends: Spend[]
  details: Detail[]
  makes: Make[]
}

export function PDFPreview({ project, resources, spends, details, makes }: PDFPreviewProps) {
  const budgetTotal = resources.reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
  const spendTotal = makes.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Rapport Budgétaire</Text>
        <Text style={styles.subtitle}>{project?.name_project}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ressources</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.cellName}>Source</Text>
              <Text style={styles.cellAmount}>Montant</Text>
              <Text style={styles.cellResource}>Utilisé</Text>
              <Text style={styles.cellRemaining}>Restant</Text>
            </View>
            {resources.map((r) => {
              const used = makes
                .filter((m) => m.resource_id === r.id)
                .reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
              return (
                <View style={styles.tableRow} key={r.id}>
                  <Text style={styles.cellName}>{r.origine_resource}</Text>
                  <Text style={styles.cellAmount}>{Number(r.price_resource).toLocaleString()} Ar</Text>
                  <Text style={styles.cellResource}>{used.toLocaleString()} Ar</Text>
                  <Text style={styles.cellRemaining}>{(r.price_resource - used).toLocaleString()} Ar</Text>
                </View>
              )
            })}
            <View style={styles.totalRow}>
              <Text style={styles.cellName}>Total</Text>
              <Text style={styles.cellAmount}>{budgetTotal.toLocaleString()} Ar</Text>
              <Text style={styles.cellResource}>{spendTotal.toLocaleString()} Ar</Text>
              <Text style={styles.cellRemaining}>{(budgetTotal - spendTotal).toLocaleString()} Ar</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail des Dépenses</Text>
          {spends.map((spend) => (
            <View key={spend.id} style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: "bold", fontSize: 11, marginBottom: 4 }}>{spend.name_spend}</Text>
              {details
                .filter((d) => d.spend_id === spend.id)
                .map((detail) => {
                  const detailMakes = makes.filter((m) => m.detail_id === detail.id)
                  return (
                    <View style={styles.tableRow} key={detail.id}>
                      <Text style={{ width: "50%", paddingLeft: 10 }}>{detail.name_detail}</Text>
                      <Text style={styles.cellAmount}>
                        {detailMakes.reduce((s, m) => s + (Number(m.price_spend) || 0), 0).toLocaleString()} Ar
                      </Text>
                    </View>
                  )
                })}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Généré le {new Date().toLocaleDateString("fr-FR")} - BudApp
        </Text>
      </Page>
    </Document>
  )
}
