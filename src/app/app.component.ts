import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('containerScreen', { static: false })
  containerScreen!: ElementRef;

  droppedItems: any[] = [];
  liveTime: Date | Number | string = new Date();

  showDeleteDialog: boolean = false;

  draggedTile: any = null;

  optionsSelect: any[] = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
  ];

  idCounter: number = 1;

  tileOptions: any[] = [];

  constructor(private dragService: DragService) {
    console.log(this.containerScreen);
  }

  ngOnInit() {
    this.startClock();
    this.loadFromLocalStorage();
    this.initializeTileOptions();
  }

  startClock() {
    setInterval(() => {
      const now = new Date();
      this.liveTime = this.liveTime = now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    }, 1000);
  }

  initializeTileOptions() {
    this.tileOptions = [
      { type: 'text', label: 'Text Input' },
      { type: 'image', imageSrc: '../assets/4320405.png' },
      {
        type: 'dropdown',
        label: 'Select Options',
        options: this.optionsSelect,
      },
      { type: 'timer', label: this.liveTime },
    ];
  }

  ngOnDestroy() {}

  generateID(): number {
    return this.idCounter++;
  }

  onDragStart(tile: any) {
    console.log(tile);

    this.draggedTile = tile;
  }

  moveTile(event: any) {
    // it does some work.
    console.log(event);

    const screenRect =
      this.containerScreen.nativeElement.getBoundingClientRect();
    console.log(screenRect);
    const x = event.clientX - screenRect.left;
    const y = event.clientY - screenRect.top;
    console.log(x, y);

    this.droppedItems.filter((id) => {
      console.log(id);

      if (id.id === this.draggedTile.id) {
        this.draggedTile = {
          ...this.draggedTile,
          x: x,
          y: y,
        };
      }
    });
    console.log(this.droppedItems);

    // this.draggedTile = {
    //   ...this.draggedTile,
    //   x: x,
    //   y: y,
    // };
    this.droppedItems.push(this.draggedTile);
    this.saveToLocalStorage();
  }

  // for left side tiles
  onDragEnded(event: any, tile?: any): void {
    console.log(tile);
    console.log(event.clientX, event.clientY);

    if (
      tile.type === 'image' &&
      this.droppedItems.some((t) => t.type === 'image')
    )
      return;

    if (
      tile.type === 'timer' &&
      this.droppedItems.some((t) => t.type === 'timer')
    )
      return;

    const screenRect =
      this.containerScreen.nativeElement.getBoundingClientRect();
    console.log(screenRect);
    const x = event.clientX - screenRect.left;
    const y = event.clientY - screenRect.top;
    console.log(x, y);

    const clonedTile = {
      ...tile,
      id: this.generateID(),
      x: x,
      y: y,
    };
    console.log(clonedTile);

    this.droppedItems.push(clonedTile);
    console.log(this.droppedItems);
    this.saveToLocalStorage();
  }

  onClear() {
    this.showDeleteDialog = !this.showDeleteDialog;
  }

  onReset() {
    this.droppedItems = [];
    this.saveToLocalStorage();
    this.showDeleteDialog = !this.showDeleteDialog;
    console.log('dropped items are', this.droppedItems);
  }

  saveToLocalStorage() {
    localStorage.setItem('droppedItems', JSON.stringify(this.droppedItems));
  }

  loadFromLocalStorage() {
    let saved = localStorage.getItem('droppedItems');
    console.log(saved);

    if (saved) {
      this.droppedItems = JSON.parse(saved);
      console.log('loaded from local storage', this.droppedItems);
    }
  }
}
