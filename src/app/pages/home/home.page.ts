import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { MetaService } from '@core/services/meta.service';
import profileData from '@data/profile.data';
import { ExpertiseArea } from '@pages/home/components/expertise-area/expertise-area';
import { Intro } from '@pages/home/components/intro/intro';
import { LanguageTools } from '@pages/home/components/language-tools/language-tools';
import { InWork } from '@pages/home/components/in-work/in-work';
import { Loader } from '@shared/components/loader/loader';
@Component({
  selector: 'home-page',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ExpertiseArea, Intro, LanguageTools, InWork, Loader],
  template: `
    @defer(on immediate){
      <intro/>
      <expertise-area/>
      <language-tools/>
      <in-work/>
    }@placeholder {
      <loader/>
    }
  `
})
export class HomePage {
  metaService = inject(MetaService);
  constructor() {
    this.metaService.setMetaTags(
      `Home - ${profileData.name}`,
      'Portfolio of a DevOps engineer from India: CI/CD pipelines, Kubernetes, cloud infrastructure as code, and the tools I use every day.',
      [
        'jayesh hadiya',
        'jayeshhadiya',
        'devops engineer',
        'india',
        'portfolio',
        'ci/cd',
        'kubernetes',
        'docker',
        'cloud',
        'infrastructure as code',
      ]
    );
  }
}
