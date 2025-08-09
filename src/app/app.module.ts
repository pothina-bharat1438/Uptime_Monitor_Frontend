import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { EndpointFormComponent } from './components/endpoint-form/endpoint-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { HistoryComponent } from './components/history/history.component';


import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [AppComponent, EndpointFormComponent, DashboardComponent, HistoryComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule,ButtonModule,DropdownModule,BrowserAnimationsModule,AppRoutingModule, SplitButtonModule, TableModule, ProgressSpinnerModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
