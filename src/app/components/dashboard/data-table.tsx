"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const inventoryData = [
  {
    codigo: "10001",
    insumo: "ACEITE DE INMERSION PARA MICROSCOPIA",
    medpres: "100 mL",
    medcnc: "",
    medtip: "I",
    medpet: "P",
    medpf: "SOLUCI",
    m202405: "0",
    m202406: "0",
    m202407: "0",
    m202408: "0",
    m202409: "0",
    m202410: "0",
    m202411: "0",
    m202412: "0",
    ock_fim_ultim: "3",
    cpma: "",
    insumo_me: "2",
    niveles: "1",
    situacion: "Normostock",
  },
  {
    codigo: "1009",
    insumo: "BECLOMETASONA DIPROPIONATO",
    medpres: "200 DOSIS",
    medcnc: "250 μg/DOSIS",
    medtip: "M",
    medpet: "P",
    medpf: "AEROSO",
    m202405: "5",
    m202406: "5",
    m202407: "4",
    m202408: "5",
    m202409: "3",
    m202410: "1",
    m202411: "6",
    m202412: "1",
    ock_fim_ultim: "18",
    cpma: "3.725490196",
    insumo_me: "51",
    niveles: "4.83",
    situacion: "Normostock",
  },
  {
    codigo: "10148",
    insumo: 'AGUJA HIPODERMICA DESCARTABLE Nº 20 G x 1"',
    medpres: "",
    medcnc: "",
    medtip: "I",
    medpet: "P",
    medpf: "UNIDAD",
    m202405: "64",
    m202406: "0",
    m202407: "0",
    m202408: "0",
    m202409: "0",
    m202410: "2",
    m202411: "8",
    m202412: "6",
    ock_fim_ultim: "684",
    cpma: "86.69642857",
    insumo_me: "56",
    niveles: "7.89",
    situacion: "Sobrestock",
  },
  {
    codigo: "10151",
    insumo: 'AGUJA HIPODERMICA DESCARTABLE Nº 21 G x 1 1/2"',
    medpres: "",
    medcnc: "",
    medtip: "I",
    medpet: "P",
    medpf: "UNIDAD",
    m202405: "10",
    m202406: "356",
    m202407: "424",
    m202408: "405",
    m202409: "387",
    m202410: "373",
    m202411: "236",
    m202412: "338",
    ock_fim_ultim: "1593",
    cpma: "212.3833333",
    insumo_me: "60",
    niveles: "7.5",
    situacion: "Sobrestock",
  },
  {
    codigo: "10155",
    insumo: 'AGUJA HIPODERMICA DESCARTABLE Nº 23 G x 1"',
    medpres: "",
    medcnc: "",
    medtip: "I",
    medpet: "P",
    medpf: "UNIDAD",
    m202405: "607",
    m202406: "529",
    m202407: "539",
    m202408: "400",
    m202409: "522",
    m202410: "449",
    m202411: "445",
    m202412: "440",
    ock_fim_ultim: "3220",
    cpma: "423.2666667",
    insumo_me: "60",
    niveles: "7.61",
    situacion: "Sobrestock",
  },
  {
    codigo: "10158",
    insumo: 'AGUJA HIPODERMICA DESCARTABLE Nº 25 G x 5/8"',
    medpres: "",
    medcnc: "",
    medtip: "I",
    medpet: "P",
    medpf: "UNIDAD",
    m202405: "0",
    m202406: "0",
    m202407: "0",
    m202408: "0",
    m202409: "2",
    m202410: "12",
    m202411: "15",
    m202412: "19",
    ock_fim_ultim: "202",
    cpma: "34.23636364",
    insumo_me: "55",
    niveles: "5.9",
    situacion: "Normostock",
  },
  {
    codigo: "10221",
    insumo: "ALCOHOL ETILICO (ETANOL)",
    medpres: "1 L",
    medcnc: "70°",
    medtip: "M",
    medpet: "P",
    medpf: "SOLUCI",
    m202405: "40",
    m202406: "11",
    m202407: "5",
    m202408: "0",
    m202409: "16",
    m202410: "2",
    m202411: "7",
    m202412: "32",
    ock_fim_ultim: "190",
    cpma: "24.76666667",
    insumo_me: "30",
    niveles: "7.67",
    situacion: "Sobrestock",
  },
  {
    codigo: "10222",
    insumo: "ALCOHOL ETILICO (ETANOL)",
    medpres: "120 mL",
    medcnc: "70°",
    medtip: "M",
    medpet: "P",
    medpf: "SOLUCI",
    m202405: "0",
    m202406: "0",
    m202407: "1",
    m202408: "0",
    m202409: "0",
    m202410: "0",
    m202411: "0",
    m202412: "0",
    ock_fim_ultim: "4",
    cpma: "1.25",
    insumo_me: "4",
    niveles: "3.2",
    situacion: "Normostock",
  },
  {
    codigo: "10230",
    insumo: "ALCOHOL ETILICO (ETANOL)",
    medpres: "1 L",
    medcnc: "96°",
    medtip: "I",
    medpet: "P",
    medpf: "SOLUCI",
    m202405: "0",
    m202406: "1",
    m202407: "0",
    m202408: "0",
    m202409: "0",
    m202410: "1",
    m202411: "2",
    m202412: "0",
    ock_fim_ultim: "2",
    cpma: "1.5",
    insumo_me: "10",
    niveles: "1.33",
    situacion: "Substock",
  },
  {
    codigo: "10244",
    insumo: "ALGODON HIDROFILO",
    medpres: "100 g",
    medcnc: "",
    medtip: "I",
    medpet: "P",
    medpf: "UNIDAD",
    m202405: "1",
    m202406: "5",
    m202407: "2",
    m202408: "2",
    m202409: "1",
    m202410: "4",
    m202411: "6",
    m202412: "4",
    ock_fim_ultim: "14",
    cpma: "3.214285714",
    insumo_me: "14",
    niveles: "4.36",
    situacion: "Normostock",
  },
];

export function DataTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[80px]">CODIGO</TableHead>
            <TableHead className="min-w-[200px]">INSUMO</TableHead>
            <TableHead>MEDPRES</TableHead>
            <TableHead>MEDCNC</TableHead>
            <TableHead>MEDTIP</TableHead>
            <TableHead>MEDPET</TableHead>
            <TableHead>MEDPF</TableHead>
            <TableHead>2024-05</TableHead>
            <TableHead>2024-06</TableHead>
            <TableHead>2024-07</TableHead>
            <TableHead>2024-08</TableHead>
            <TableHead>2024-09</TableHead>
            <TableHead>2024-10</TableHead>
            <TableHead>2024-11</TableHead>
            <TableHead>2024-12</TableHead>
            <TableHead>OCK_FIM_ULTIM</TableHead>
            <TableHead>CPMA</TableHead>
            <TableHead>INSUMO_ME</TableHead>
            <TableHead>NIVELES</TableHead>
            <TableHead>SITUACION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryData.map((item, index) => (
            <TableRow key={index} className={getSituationClass(item.situacion)}>
              <TableCell>{item.codigo}</TableCell>
              <TableCell>{item.insumo}</TableCell>
              <TableCell>{item.medpres}</TableCell>
              <TableCell>{item.medcnc}</TableCell>
              <TableCell>{item.medtip}</TableCell>
              <TableCell>{item.medpet}</TableCell>
              <TableCell>{item.medpf}</TableCell>
              <TableCell>{item.m202405}</TableCell>
              <TableCell>{item.m202406}</TableCell>
              <TableCell>{item.m202407}</TableCell>
              <TableCell>{item.m202408}</TableCell>
              <TableCell>{item.m202409}</TableCell>
              <TableCell>{item.m202410}</TableCell>
              <TableCell>{item.m202411}</TableCell>
              <TableCell>{item.m202412}</TableCell>
              <TableCell>{item.ock_fim_ultim}</TableCell>
              <TableCell>{item.cpma}</TableCell>
              <TableCell>{item.insumo_me}</TableCell>
              <TableCell>{item.niveles}</TableCell>
              <TableCell>{item.situacion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getSituationClass(situation: string): string {
  switch (situation) {
    case "Sobrestock":
      return "bg-yellow-50";
    case "Substock":
      return "bg-red-50";
    case "Normostock":
    default:
      return "";
  }
}
