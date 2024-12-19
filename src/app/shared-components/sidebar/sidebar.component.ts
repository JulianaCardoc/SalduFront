import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartLine, faFileLines, faList, faDolly, faChartBar, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, RouterLink],
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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
