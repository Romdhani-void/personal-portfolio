import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-distance-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './distance-badge.component.html',
  styleUrls: ['./distance-badge.component.css'],
})
export class DistanceBadgeComponent implements OnInit {
  /** Your location (defaults to Szeged, HU). Change if needed. */
  @Input() lat = 46.253;   // Szeged
  @Input() lng = 20.141;
  @Input() cityLabel = 'Szeged, HU';

  km = signal<number | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    if (!('geolocation' in navigator)) {
      this.error.set('Geolocation not supported');
      return;
    }

    // Ask after first paint to keep UI snappy
    queueMicrotask(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const d = this.haversine(
            this.lat,
            this.lng,
            pos.coords.latitude,
            pos.coords.longitude
          );
          this.km.set(d);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) this.error.set('Location access denied');
          else this.error.set('Cannot read location');
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
      );
    });
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
