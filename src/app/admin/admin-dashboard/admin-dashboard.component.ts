import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  isArtist = false;
  constructor() { }

  ngOnInit() {
  }

  changeTypeSelected() {
    this.isArtist = (this.isArtist === false) ? true : false;
  }

}
