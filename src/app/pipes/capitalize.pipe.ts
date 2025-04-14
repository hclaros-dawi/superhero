import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
  name: 'capitalize',
  standalone: true,
})

@Injectable({
  providedIn: 'root',
})

export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  }
}
