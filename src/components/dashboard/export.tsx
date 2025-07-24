"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { useState } from "react"

export default function Component(data) {
  const [isGenerating, setIsGenerating] = useState(false)

  const exportToPDFSimple = async () => {
    setIsGenerating(true)

    const { jsPDF } = await import("jspdf")

    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text("Reporte de inventario historico", 20, 20)

    // Fecha de generación
    doc.setFontSize(12)
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 20, 35)

    // Datos en formato tabla simple
    let yPosition = 50
    doc.setFontSize(14)
    doc.text("ID", 20, yPosition)
    doc.text("Nombre", 40, yPosition)
    doc.text("Email", 100, yPosition)
    doc.text("Fecha", 160, yPosition)

    yPosition += 10
    doc.setFontSize(10)

    data.forEach((item) => {
      doc.text(item.id.toString(), 20, yPosition)
      doc.text(item.nombre, 40, yPosition)
      doc.text(item.email, 100, yPosition)
      doc.text(item.fecha, 160, yPosition)
      yPosition += 10
    })

    // Descargar el PDF
    doc.save("reporte-usuarios.pdf")
    setIsGenerating(false)
  }

  // Opción 2: Usando html2canvas + jsPDF (para capturar el HTML)
  const exportToPDFFromHTML = async () => {
    setIsGenerating(true)

    const { jsPDF } = await import("jspdf")
    const html2canvas = (await import("html2canvas")).default

    // Capturar el elemento HTML
    const element = document.getElementById("data-table")
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF()

    // Calcular dimensiones
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Agregar la imagen al PDF
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Si el contenido es más alto que una página, agregar páginas adicionales
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save("reporte-tabla.pdf")
    setIsGenerating(false)
  }



  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exportar Datos a PDF</CardTitle>
          <CardDescription>Diferentes opciones para exportar tus datos a PDF desde el frontend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={exportToPDFSimple} disabled={isGenerating} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              PDF Simple (jsPDF)
            </Button>

            <Button
              onClick={exportToPDFFromHTML}
              disabled={isGenerating}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              PDF desde HTML
            </Button>


          </div>

          {isGenerating && <p className="text-sm text-muted-foreground">Generando PDF...</p>}
        </CardContent>
      </Card>


    </div>
  )
}
