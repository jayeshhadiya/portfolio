import { Injectable, Signal, computed, signal } from '@angular/core';
import { of, tap } from 'rxjs';
import { LanguageTool } from '@pages/home/components/language-tools/language-tool.interface';
// Bundled at build time (not fetched) so server-side rendering and prerendering can read it.
import languageToolsJson from '../../../../../assets/json/language-tools.json';
export interface LanguageToolState {
  data: LanguageTool[];
}

@Injectable({
  providedIn: 'root',
})
export class LanguageToolService {
  constructor() {
    this.getAll();
  }
  public state = signal<LanguageToolState>({ data: [] });
  public languageTools: Signal<LanguageTool[]> = computed(
    () => this.state().data
  );

  getAll(): void {
    of(languageToolsJson as LanguageTool[])
      .pipe(
        tap((data: LanguageTool[]) => {
          this.state.update((state: LanguageToolState) => ({ ...state, data }));
        })
      )
      .subscribe();
  }
}
