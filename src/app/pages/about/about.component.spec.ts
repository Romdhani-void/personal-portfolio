<nav class="fixed top-0 left-0 w-full z-[60] backdrop-blur bg-white/50">
  <app-navbar></app-navbar>
</nav>

<section class="relative w-full min-h-screen overflow-hidden">
  <div class="pointer-events-none absolute inset-0 -z-20">
    <div class="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 opacity-30 blur-3xl"></div>
    <div class="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 opacity-30 blur-3xl"></div>
    <div class="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-25 blur-3xl"></div>
  </div>

  <div class="mx-auto max-w-6xl px-6 pt-32 pb-24">
    <!-- header badge + title (centered like the attachment) -->
    <div class="text-center mb-8">
      <span class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-rose-500 text-white shadow">
        About Me
      </span>

      <h1 class="mt-6 text-5xl font-extrabold leading-[1.02] text-slate-900">Who am I ?</h1>
    </div>

    <div class="grid gap-8 lg:grid-cols-12 lg:items-start">
      <!-- left profile card -->
      <div class="lg:col-span-4">
        <div class="profile-card rounded-2xl bg-white p-6 shadow-xl">
          <div class="flex justify-center">
            <div class="avatar-wrap relative">
              <img src="assets/img/dali.jpg" alt="{{ name }}" class="avatar-img">
            </div>
          </div>

          <div class="mt-5 text-center">
            <p class="font-bold text-xl text-slate-900">{{ name }}</p>
            <p class="text-sm text-slate-400 mt-0.5">{{ pronouns }}</p>

            <p class="mt-3 text-sm text-slate-700">
              {{ title }}
              <br>
              <span class="font-semibold accent-text">&#64;{{ currentEmployer }}</span>
            </p>
          </div>

          <div class="mt-6 border-t border-slate-100 pt-5 space-y-3 text-sm text-slate-600">
            <div class="flex items-center gap-3">
              <span class="meta-icon">🏢</span>
              <span>{{ currentEmployer }} &middot; Hungary</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="meta-icon">📍</span>
              <span>{{ location }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="meta-icon">🕒</span>
              <span>{{ localTime }} (UTC +02:00)</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="meta-icon">🔗</span>
              
                href="https://www.linkedin.com/in/{{ linkedin }}"
                target="_blank"
                rel="noopener noreferrer"
                class="accent-text hover:underline"
              >
                in/{{ linkedin }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- right info card -->
      <div class="lg:col-span-8">
        <div class="info-card rounded-2xl bg-white p-8 shadow-2xl">
          <p class="text-slate-700">I’m Dally, a software engineer who likes building things that work and look clean. My goal is to keep improving one step, one commit at a time.</p>

          <blockquote class="mt-6 border-l-4 border-rose-500 pl-4 italic text-slate-500">“Keep things clear. Keep learning. Build what matters.”</blockquote>

          <div class="mt-6 flex gap-3 flex-wrap">
            <button class="pill">MEAN Stack</button>
            <button class="pill">DevOps</button>
            <button class="pill">On My Desk</button>
          </div>

          <div class="mt-8 flex items-center gap-4">
            <a href="assets/docs/Romdhani-Resume.pdf" download="Romdhani-Resume.pdf" class="cta-primary">Download Resume</a>
            <a routerLink="/work" class="cta-outline">View My Work</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>