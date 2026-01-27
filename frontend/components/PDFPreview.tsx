import { Text, View, Document, Page, StyleSheet } from '@react-pdf/renderer';
import type { Budget } from '@/types/BudgetTypes';
import { editMoney } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    position: 'relative',
    paddingBottom: 80
  },
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 4,
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2980b9'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    backgroundColor: '#fff',
    ':nth-child-even': {
      backgroundColor: '#f8f9fa'
    }
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 8,
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 5
  },
  cell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 5,
    textAlign: 'center',
    color: '#2c3e50'
  },
  amountCell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 5,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#7f8c8d',
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    paddingTop: 10,
    marginHorizontal: 40
  },
  totalsContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#3498db',
    borderTopStyle: 'solid'
  },
  totalRow: {
    flexDirection: 'row', 
    paddingVertical: 5
  },
  totalLabel: {
    flex: 2, 
    fontWeight: 'bold',
    fontSize: 10,
    color: '#2c3e50',
    textAlign: 'right'
  },
  totalValue: {
    flex: 1, 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 10,
    color: '#e74c3c'
  }
});

export function PDFPreview({ budget, title }: { budget: Budget, title?: string }) {
  // Calcul du solde restant pour chaque ressource
  const resourceBalances: Record<number, number> = {};
  budget.ressource.forEach(res => {
    resourceBalances[res.id] = res.prix;
  });

  // Création des données combinées avec calcul du solde
  const tableData = budget.make.map(make => {
    const detail = budget.detail.find(d => d.id === make.detail_id);
    const depense = detail ? budget.depense.find(d => d.id === detail.depense_id) : null;
    const resource = budget.ressource.find(r => r.id === make.ressource_id);

    const currentBalance = resource ? resourceBalances[resource.id] : 0;

    // Mise à jour du solde
    if (resource && make.prix) {
        resourceBalances[resource.id] -= make.prix;
    }

    return {
      depenseName: depense?.name || 'Non spécifié',
      motif: detail?.value || 'Non spécifié',
      resourceName: resource?.name || 'Non spécifié',
      depensePrix: make.prix || 0,
      resourceInitial: resource?.prix || 0,
      resourceCurrent: currentBalance,
      remainingBalance: resource ? resourceBalances[resource.id] : 0
    };
  });

  const totalDepenses = tableData.reduce((sum, row) => sum + row.depensePrix, 0);
  
  const totalRemaining = Object.values(resourceBalances).reduce((sum, balance) => sum + balance, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{ title ?? "RAPPORT BUDGÉTAIRE" }</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 1.2 }]}>Dépense</Text>
            <Text style={[styles.headerCell, { flex: 1.5 }]}>Motif</Text>
            <Text style={styles.headerCell}>Ressource</Text>
            <Text style={styles.headerCell}>Solde Dépense</Text>
            <Text style={styles.headerCell}>Solde Ressource</Text>
            <Text style={styles.headerCell}>Solde Restant</Text>
          </View>
          
          {tableData.map((row, index) => (
            <View key={`row-${index}`} style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 1.2 }]}>{row.depenseName}</Text>
              <Text style={[styles.cell, { flex: 1.5 }]}>{row.motif}</Text>
              <Text style={styles.cell}>{row.resourceName}</Text>
              <Text style={styles.amountCell}>{editMoney(row.depensePrix, ',')} Ar</Text>
              <Text style={styles.amountCell}>{editMoney(row.resourceCurrent, ',')} Ar</Text>
              <Text style={styles.amountCell}>{editMoney(row.remainingBalance, ',')} Ar</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsContainer}>
          <View style={{ width: '60%' }}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Dépenses:</Text>
              <Text style={styles.totalValue}>{editMoney(totalDepenses, ',')} Ar</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Ressources initial:</Text>
              <Text style={styles.totalValue}>{editMoney(totalDepenses + totalRemaining, ',')} Ar</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Solde Total Restant:</Text>
              <Text style={[styles.totalValue, { color: totalRemaining >= 0 ? '#27ae60' : '#e74c3c' }]}>
                {editMoney(totalRemaining, ',')} Ar
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Document généré le {new Date().toLocaleDateString('fr-FR')} par le Responsable Budgetaire</Text>
          <Text>© {new Date().getFullYear()} Direction Financière - Tous droits réservés</Text>
        </View>
      </Page>
    </Document>
  );
}