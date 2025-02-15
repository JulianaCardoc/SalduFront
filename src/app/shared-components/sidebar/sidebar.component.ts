import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { faChartLine, faStore, faXmark, faBars, faUser, faUserPen, faUserPlus, faNotdef, faImages, faFileArrowUp, faChevronDown, faUsers, faFileLines, faList, faDolly, faChartBar, faRightFromBracket, faX, faFileInvoice, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CdkAccordionModule, FontAwesomeModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  faChartLine = faChartLine;
  faFileLines = faFileLines;
  faList = faList;
  faDolly = faDolly;
  faChartBar = faChartBar;
  faRightFromBracket = faRightFromBracket;
  faX = faX;
  faChevronDown = faChevronDown;
  faUsers = faUsers;
  faFileInvoice = faFileInvoice;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faFileArrowUp = faFileArrowUp;
  faImages = faImages;
  faNotdef = faNotdef;
  faUserPlus = faUserPlus;
  faUserPen = faUserPen;
  faUser = faUser;
  faBars = faBars;
  faXmark = faXmark;
  faStore = faStore;

  @Input() isSidebarVisible = false;
  @Output() closeSidebar = new EventEmitter<void>();

  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
