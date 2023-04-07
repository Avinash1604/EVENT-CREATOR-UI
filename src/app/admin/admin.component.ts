import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from '../shared/pages-menu';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  menu = MENU_ITEMS;
  constructor() { }

  ngOnInit(): void {
  }

}
