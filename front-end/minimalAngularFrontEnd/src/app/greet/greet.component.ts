import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-greet',
  standalone: true,
  imports: [],
  templateUrl: './greet.component.html',
  styleUrl: './greet.component.scss'
})
export class GreetComponent {
  message: string = "";

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.fetchGreetingMessage();
  }

  fetchGreetingMessage(): void {
    let greetMessage$ = this.backendService.greeting();
    greetMessage$.subscribe(val => { console.log(val); });
  }
}
