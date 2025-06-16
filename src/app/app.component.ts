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
  droppedItems: any[] = [];
  liveTime: Date | Number | string = new Date();

  showDeleteDialog: boolean = false;

  optionsSelect: any[] = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
  ];

  idCounter: number = 0;

  private timeSubscription: Subscription;

  tileOptions: any[] = [
    { type: 'text', label: 'Text Input' },
    { type: 'image', imageSrc: '../assets/4320405.png' },
    { type: 'dropdown', label: 'Select Options', options: this.optionsSelect },
    { type: 'timer', label: this.liveTime },
  ];

  constructor(private dragService: DragService) {
    this.timeSubscription = timer(0, 1000)
      .pipe(map(() => new Date().toLocaleTimeString()))
      .subscribe((now) => {
        this.liveTime = now;
      });
  }

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
    this.loadFromLocalStorage();
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  generateID(): number {
    return this.idCounter++;
  }

  onDragStart(event: DragEvent, tile: any) {
    const clonedTile = {
      ...tile,
      id: this.generateID(),
      x: tile.x,
      y: tile.y,
    };
    this.droppedItems.push(clonedTile);
  }

  onDragEnded(event: any, tile?: any): void {
    console.log(tile);
    const { x, y } = event.source.getFreeDragPosition();
    console.log(x, y);

    const clonedTile = {
      ...tile,
      id: this.generateID(),

      x: x,
      y: y,
    };
    this.droppedItems.push(clonedTile);
    console.log(this.droppedItems);
    this.saveToLocalStorage();
  }

  onClear() {
    this.showDeleteDialog = !this.showDeleteDialog;
  }

  onReset() {
    localStorage.removeItem('droppedItems');
    this.showDeleteDialog = !this.showDeleteDialog;
  }

  saveToLocalStorage() {
    localStorage.setItem('droppedItems', JSON.stringify(this.droppedItems));
  }

  loadFromLocalStorage() {
    // this.droppedItems = localStorage.getItem('droppedItems');
  }
}
