import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  signal,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

type LatLng = { lat: number; lng: number };

@Component({
  selector: 'app-distance-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './distance-badge.component.html',
  styleUrls: ['./distance-badge.component.css'],
})
export class DistanceBadgeComponent implements AfterViewInit, OnDestroy {
  @Input() lat = 46.253; // Szeged, HU
  @Input() lng = 20.141;
  @Input() cityLabel = 'Szeged, HU';

  /** 'geo' | 'ip' | 'auto' (VPN-aware if 'ip' or fallback) */
  @Input() locateBy: 'geo' | 'ip' | 'auto' = 'auto';

  private platformId = inject(PLATFORM_ID);

  hidden = signal(false);
  loading = signal(true);
  user = signal<LatLng | null>(null);
  country = signal<string | null>(null);
  distanceKm = signal<number | null>(null);

  greeting = computed(() => {
    const c = (this.country() || '').trim();
    if (!c) return '';
    return c.toLowerCase() === 'hungary'
      ? 'Szia! seems we’re in same paprika country :D'
      : `Hi there from ${c}`;
  });

  // Leaflet instances
  private map: L.Map | null = null;
  private userMarker: L.Marker | null = null;
  private destMarker: L.Marker | null = null;
  private path: L.Polyline | null = null;
  private dashTimer: number | null = null;
  private pinIcon: L.Icon | null = null;

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) { this.hide(); return; }

    const ok = await this.resolveUserPosition();
    if (!ok) { this.hide(); return; }

    // Use explicit icon so we never see "Marker" fallback text
    this.pinIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -28],
      shadowSize: [41, 41],
      className: 'dali-pin',
    });

    const you = this.user()!;
    this.initMap(you, { lat: this.lat, lng: this.lng });
    this.loading.set(false);
  }

  ngOnDestroy(): void {
    if (this.dashTimer) window.clearInterval(this.dashTimer);
    try { this.map?.remove(); } catch {}
  }

  // --- internals ---
  private hide() { this.hidden.set(true); this.loading.set(false); }

  private async resolveUserPosition(): Promise<boolean> {
    const useIp = this.locateBy === 'ip';
    const useGeo = this.locateBy === 'geo';
    if (useIp) return this.resolveViaIp();
    if (useGeo) return this.resolveViaGeo(true);
    // auto
    const ok = await this.resolveViaGeo(false);
    return ok ? true : this.resolveViaIp();
  }

  private resolveViaGeo(hideOnError: boolean): Promise<boolean> {
    if (!('geolocation' in navigator)) { if (hideOnError) this.hide(); return Promise.resolve(false); }
    return new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const you = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          this.applyUserAndDistance(you);
          // country (best-effort)
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${you.lat}&lon=${you.lng}&zoom=3&addressdetails=1`;
            const r = await fetch(url, { headers: { Accept: 'application/json' } });
            const data = await r.json().catch(() => null);
            this.country.set(data?.address?.country ?? null);
          } catch {}
          resolve(true);
        },
        () => { if (hideOnError) this.hide(); resolve(false); },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
      );
    });
  }

  private async resolveViaIp(): Promise<boolean> {
    try {
      const r = await fetch('https://ipapi.co/json/', { headers: { Accept: 'application/json' } });
      if (!r.ok) return false;
      const data = await r.json();
      const lat = data.latitude ?? data.lat;
      const lng = data.longitude ?? data.lon;
      if (typeof lat !== 'number' || typeof lng !== 'number') return false;
      this.applyUserAndDistance({ lat, lng });
      this.country.set(data.country_name ?? data.country ?? null);
      return true;
    } catch { return false; }
  }

  private applyUserAndDistance(you: LatLng) {
    this.user.set(you);
    this.distanceKm.set(this.haversine({ lat: this.lat, lng: this.lng }, you));
  }

  private initMap(user: LatLng, dest: LatLng): void {
    this.map = L.map('distanceMap', {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false, // nicer UX on page scroll
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Use explicit icon and no title to avoid “Marker” overlays
    this.userMarker = L.marker([user.lat, user.lng], { icon: this.pinIcon!, title: '' })
      .addTo(this.map).bindPopup('You');
    this.destMarker = L.marker([dest.lat, dest.lng], { icon: this.pinIcon!, title: '' })
      .addTo(this.map).bindPopup(this.cityLabel);

    const bounds = L.latLngBounds([user.lat, user.lng], [dest.lat, dest.lng]).pad(0.25);
    this.map.fitBounds(bounds);

    this.path = L.polyline([[user.lat, user.lng], [dest.lat, dest.lng]], {
      color: '#ef4444',
      weight: 4,
      opacity: 0.95,
      dashArray: '10 12',
      lineCap: 'round',
      dashOffset: '0px',
    }).addTo(this.map);

    // Animate dash offset (~30fps)
    let offset = 0;
    this.dashTimer = window.setInterval(() => {
      this.path?.setStyle({ dashOffset: `${offset}px` });
      offset = (offset + 2) % 1000;
    }, 33);
  }

  private haversine(a: LatLng, b: LatLng): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }
}
