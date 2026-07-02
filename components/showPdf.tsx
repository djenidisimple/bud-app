'use client'

import { useState } from "react"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PDFPreview } from "@/components/PDFPreview"
import { FileDown, FileText } from "lucide-react"

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

interface PDFExportButtonProps {
  project: Project
  resources: Resource[]
  spends: Spend[]
  details: Detail[]
  makes: Make[]
}

export function PDFExportButton({ project, resources, spends, details, makes }: PDFExportButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Exporter PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Aperçu du PDF</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <PDFViewer className="w-full h-[calc(80vh-80px)]" showToolbar={false}>
            <PDFPreview
              project={project}
              resources={resources}
              spends={spends}
              details={details}
              makes={makes}
            />
          </PDFViewer>
        </div>
        <div className="flex justify-end">
          <PDFDownloadLink
            document={
              <PDFPreview
                project={project}
                resources={resources}
                spends={spends}
                details={details}
                makes={makes}
              />
            }
            fileName={`rapport-${project?.name_project || "budget"}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading}>
                <FileDown className="mr-2 h-4 w-4" />
                {loading ? "Génération..." : "Télécharger"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </DialogContent>
    </Dialog>
  )
}
