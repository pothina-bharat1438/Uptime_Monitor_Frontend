import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  endpointHistoryData: any[] = [];
  endpointId: string | null = null;
  loading = false;
  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Endpoint ID:', this.endpointId);

      this.fetchHistory()
    });
  }

  retryFetch(): void {
    this.fetchHistory()
  }

  fetchHistory(): void {
  if (this.endpointId) {
    this.loading = true;
    this.api.endpointHistory(this.endpointId).subscribe({
      next: (data) => {
        this.endpointHistoryData = data;
        console.log(this.endpointHistoryData, 'dddfff')
        this.loading = false;
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.endpointHistoryData = [];
        this.loading = false;
      }
    });
  }
}
}

