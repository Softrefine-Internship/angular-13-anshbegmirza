import { Injectable } from '@angular/core';
import { Tile } from './tile.model';

@Injectable({
  providedIn: 'root'
})
export class DragService {
  tile: Tile[] = [
  ]
  constructor() { }
}
