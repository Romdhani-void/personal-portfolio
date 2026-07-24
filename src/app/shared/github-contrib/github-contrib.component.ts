import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type PublicUser = {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

@Component({
  selector: 'app-github-contrib',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './github-contrib.component.html',
  styleUrls: ['./github-contrib.component.css'],
})
export class GithubContribComponent implements OnInit {
  /** Your GitHub username, e.g., 'romdhaniali' */
  @Input({ required: true }) username!: string;

  loaded = signal(false);
  stats = signal<PublicUser>({
    public_repos: 0,
    followers: 0,
    following: 0,
    created_at: new Date().toISOString(),
  });

  async ngOnInit() {
    try {
      const r = await fetch(`https://api.github.com/users/${this.username}`, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (r.ok) {
        const data = (await r.json()) as PublicUser;
        this.stats.set(data);
      }
    } catch {
      // ignore errors; keep zeros
    } finally {
      this.loaded.set(true);
    }
  }

  accountAgeYears(): number {
    const y = new Date(this.stats().created_at).getFullYear();
    return Math.max(0, new Date().getFullYear() - y);
  }
}
