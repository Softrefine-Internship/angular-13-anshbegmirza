import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tile } from './shared/tile.model';
import { DragService } from './shared/drag.service';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-13';

  optionsSelect: any[] = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
  ];

  value = 'clear me';

  constructor(private dragService: DragService) {
    this.timeSubscription = timer(0, 1000)
      .pipe(map(() => new Date()))
      .subscribe((now) => {
        this.liveTime = now;
      });
  }

  liveTime: Date | Number | string = new Date();
  private timeSubscription: Subscription;

  ngOnInit() {
    this.timeSubscription = timer(0, 2000)
      .pipe(map(() => new Date().toLocaleString()))
      .subscribe((now) => {
        this.liveTime = now;
      });
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
