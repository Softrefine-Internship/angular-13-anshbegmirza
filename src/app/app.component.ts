import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Tile } from './shared/tile.model';
import { DragService } from './shared/drag.service';

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

  dragOffsetX: number = 0;
  dragOffsetY: number = 0;

  constructor(private dragService: DragService) {
    // console.log(this.containerScreen);
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

  onDragStart(event: any, tile: any) {
    // console.log(tile);

    this.draggedTile = tile;

    this.draggedTile = tile;
    const tileEl = event.target as HTMLElement;
    const rect = tileEl.getBoundingClientRect();
    this.dragOffsetX = event.clientX - rect.left;
    this.dragOffsetY = event.clientY - rect.top;
    // console.log(this.dragOffsetX, this.dragOffsetY);
  }

  //for already placed tiles
  moveTile(event: any) {
    if (!this.draggedTile) {
      return;
    }

    const screenRect =
      this.containerScreen.nativeElement.getBoundingClientRect();

    let x = event.clientX - screenRect.left - this.dragOffsetX;
    let y = event.clientY - screenRect.top - this.dragOffsetY;

    if (
      (x < 0 || y < 0 || x > screenRect.height || y > screenRect.width,
      x === screenRect.width || y === screenRect.height)
    ) {
      return;
    }

    const padding = 1;

    const tileEl = event.target as HTMLElement;
    const tileWidth = tileEl.offsetWidth;
    const tileHeight = tileEl.offsetHeight;

    // console.log(tileWidth, tileHeight);

    // these will define the cursor placement on tile;
    let shiftX = event.clientX - tileEl.getBoundingClientRect().left;
    let shiftY = event.clientY - tileEl.getBoundingClientRect().top;

    // console.log(`Shift coordinates are`, shiftX, shiftY);

    //now change my function to fit to the cursor position

    const minX = padding;
    const minY = padding;
    const maxX = screenRect.width - tileWidth - padding;
    const maxY = screenRect.height - tileHeight - padding;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    this.draggedTile.x = x;
    this.draggedTile.y = y;
    this.draggedTile = null;
    this.saveToLocalStorage();
  }

  onPaletteDragStart(event: any, tile: any) {
    const tileEl = event.target as HTMLElement;
    const rect = tileEl.getBoundingClientRect();
    this.dragOffsetX = event.clientX - rect.left;
    this.dragOffsetY = event.clientY - rect.top;

    if (tile.type === 'image') {
      const img = new Image();
      img.src = tile.imageSrc;

      img.style.height = '10px !important';
      img.style.width = '10px !important';
      // img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.onload = () => {
        // setDragImage(imgElement, xOffset, yOffset)
        event.dataTransfer?.setDragImage(img, 1, 1);
      };
      event.dataTransfer?.setDragImage(img, 1, 1);
    }
  }

  onDragEnded(event: any, tile?: any): void {
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

    const tileEl = event.target as HTMLElement;
    const tileWidth = tileEl.offsetWidth;
    const tileHeight = tileEl.offsetHeight;

    let x = event.clientX - screenRect.left - this.dragOffsetX;
    let y = event.clientY - screenRect.top - this.dragOffsetY;

    x = Math.max(0, Math.min(x, screenRect.width - tileWidth));
    y = Math.max(0, Math.min(y, screenRect.height - tileHeight));

    const clonedTile = {
      ...tile,
      id: this.generateID(),
      x: x,
      y: y,
    };

    this.droppedItems.push(clonedTile);
    this.saveToLocalStorage();
  }

  onClear() {
    this.showDeleteDialog = !this.showDeleteDialog;
  }

  onReset() {
    this.droppedItems = [];
    this.saveToLocalStorage();
    this.showDeleteDialog = !this.showDeleteDialog;
  }

  saveToLocalStorage() {
    localStorage.setItem('droppedItems', JSON.stringify(this.droppedItems));
  }

  loadFromLocalStorage() {
    let saved = localStorage.getItem('droppedItems');

    if (saved) {
      this.droppedItems = JSON.parse(saved);
    }
  }
}
