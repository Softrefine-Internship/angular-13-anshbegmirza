import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tile } from './shared/tile.model';
import { DragService } from './shared/drag.service';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-13';

  droppedItems: any[] = [];

  liveTime: Date | Number | string = new Date();

  optionsSelect: any[] = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
  ];

  // tileOptions: any[] = [
  //   'text',
  //   '../assets/4320405.png',
  //   ['1', '2', '3'],
  //   this.liveTime,
  // ];

  tileOptions: any[] = [
    { case1: 'text' },
    { case2: '../assets/4320405.png' },
    { case3: ['1', '2', '3'] },
    { case4: this.liveTime },
  ];

  value = 'clear me';

  constructor(private dragService: DragService) {
    this.timeSubscription = timer(0, 1000)
      .pipe(map(() => new Date().toLocaleTimeString()))
      .subscribe((now) => {
        this.liveTime = now;
      });
  }

  private timeSubscription: Subscription;

  ngOnInit() {
    this.timeSubscription = timer(0, 1000)
      .pipe(map(() => new Date()))
      .subscribe((now) => {
        this.liveTime = now.toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      });
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('text/plain', 'This is the data being dragged');
  }

  onDragEnded(event: CdkDragEnd): void {
    console.log(event.source.getFreeDragPosition());
  }

  onReset() {
    this.dragService.onResetLocalStorage();
  }
}
