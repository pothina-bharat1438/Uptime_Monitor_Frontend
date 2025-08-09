import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  endpoints: any[] = [];
  loading = true;
  error = false;
  exportOptions = [
    {
      label: 'Download PDF',
      icon: 'pi pi-file-pdf',
      command: () => this.downloadPdf()
    },
    {
      label: 'Download Excel',
      icon: 'pi pi-file-excel',
      command: () => this.downloadCsv()
    }
  ];


  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.loadEndpoints();

    this.api.onRefresh().subscribe(() => {
      this.loadEndpoints();
    });
  }

  loadEndpoints() {
    this.loading = true;
    this.error = false;

    this.api.getEndpoints().subscribe({
      next: data => {
        this.endpoints = data.map((ep: any) => ({
          ...ep,
          actions: this.buildMenuItems(ep.id)
        }));
        this.loading = false;
      },
      error: err => {
        console.error('Error loading endpoints:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  retry() {
    this.loadEndpoints();
  }

  buildMenuItems(id: number) {
    return [
      {
        label: 'View History',
        icon: 'pi pi-clock',
        command: () => this.viewHistory(id)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.delete(id)
      }
    ];
  }

  viewHistory(endpointId: number) {
    this.router.navigate(['/history', endpointId]);
  }

  delete(id: number) {
    this.api.deleteEndpoint(id).subscribe(() => this.api.getEndpoints().subscribe(data => this.endpoints = data));
  }

  // downloadPdf() {
  //   const doc = new jsPDF();

  //   // Title
  //   doc.setFontSize(16);
  //   doc.text('API Endpoints Report', 14, 15);

  //   // Table headers
  //   const headers = [
  //     ['Name', 'Method', 'URL', 'Status', 'Response Time (ms)', 'Checked At']
  //   ];

  //   // Table data
  //   const data = this.endpoints.map(ep => [
  //     ep.name,
  //     ep.method,
  //     ep.url,
  //     ep.status,
  //     ep.response_time,
  //     new Date(ep.timestamp).toLocaleString()
  //   ]);

  //   // Add autoTable
  //   autoTable(doc, {
  //     startY: 20,
  //     head: headers,
  //     body: data,
  //     styles: { fontSize: 9 },
  //     headStyles: { fillColor: [41, 128, 185] }
  //   });

  //   // Save PDF
  //   const now = new Date();
  //   const formattedDate = now.toISOString().split('T')[0];
  //   const filename = `api_endpoints_report_${formattedDate}.pdf`;
  //   doc.save(filename);
  // }
downloadPdf() {
  // Hide "Actions" column before export
  document.querySelectorAll('.no-export').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });

  const tableElement = document.getElementById('dashboardTable');
  if (!tableElement) return;

  // Prevent header text from wrapping
  tableElement.querySelectorAll('th').forEach(th => {
    (th as HTMLElement).style.whiteSpace = 'nowrap';
  });

  html2canvas(tableElement, {
    scale: 3, // higher resolution to prevent text compression
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
    width: tableElement.scrollWidth,        // capture full table width
    windowWidth: tableElement.scrollWidth   // make sure rendering is full width
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Calculate margins (in mm)
const margin = 10; // 10mm on each side

// Calculate image dimensions for PDF
const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

// Add image to PDF with margin
pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    pdf.save(`api_endpoints_report_${formattedDate}.pdf`);

    // Restore Actions column
    document.querySelectorAll('.no-export').forEach(el => {
      (el as HTMLElement).style.display = '';
    });
  });
}


  downloadCsv() {
    const csvRows = [];
    const headers = ['Name', 'Method', 'URL', 'Status', 'Response Time (ms)', 'Checked At'];
    csvRows.push(headers.join(','));

    for (const ep of this.endpoints) {
      const row = [
        `"${ep.name}"`,
        ep.method,
        `"${ep.url}"`,
        ep.status,
        ep.response_time,
        new Date(ep.timestamp).toLocaleString()
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    a.download = `api_endpoints_report_${formattedDate}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  }


}
