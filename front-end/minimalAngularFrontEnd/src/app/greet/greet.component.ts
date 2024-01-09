import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-greet',
  standalone: true,
  imports: [],
  templateUrl: './greet.component.html',
  styleUrl: './greet.component.scss'
})
export class GreetComponent {
  message: string = "";

  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit(): void {
    this.fetchGreetingMessage();
  }

  fetchGreetingMessage(): void {
    let greetMessage$ = this.backendService.greeting();
    greetMessage$.subscribe(val => { console.log(val); this.message = val.result; });
  }

  navigateToCards(): void {
    this.router.navigate(['/cards']);
  }
}
