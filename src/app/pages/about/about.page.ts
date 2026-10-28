import { NgFor } from '@angular/common';
import { Component, ViewEncapsulation, effect, inject } from '@angular/core';
import { MetaService } from '@core/services/meta.service';
import { TraktTvService } from '@core/services/trakt-tv.service';
import profileData from '@data/profile.data';
import { Watch } from '@shared/components/watch/watch'
import { ContactForm } from '@shared/components/contact-form/contact-form'
@Component({
  selector: 'about',
  template: `
  <section class="flex flex-col max-w-screen-lg justify-between mx-auto gap-16 dark:text-gray-200 overflow-y-hidden">
  <div class="flex flex-col gap-5">
      <h1 class="text-2xl font-semibold dark:text-white">About Me</h1>
      <p class="justify-start">I'm Jayesh Hadiya, a DevOps engineer with
        3 years of experience. I build and automate the pipelines and infrastructure that help teams
        ship software quickly, reliably, and securely. 🚀</p>
      <p *ngFor="let a of aboutDetails"><b class="dark:text-white text-black">{{a.title}}</b><br />{{a.desc}}
      </p>
  </div>
  @if(traktTvService.enabled){
  <div class="flex flex-col gap-5">
  <h1 class="text-2xl font-semibold dark:text-white">Activity:</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <watch/>
  </div>
  </div>
  }

<div class="flex flex-col gap-5">
<h1 class="text-2xl font-semibold dark:text-white">Contact Information:</h1>
  @for(c of contactInfo; track $index){
    <p>
      <b class="dark:text-white text-black ">{{c.title}}:</b><br />
      <a [href]="c.link" class="hover:underline" target="_blank">{{c.desc}}</a>
    </p>
  }
</div>

<div class="flex flex-col gap-5">
  <h1 class="text-2xl font-semibold dark:text-white">Send me a message:</h1>
  <contact-form/>
</div>
</section>
`,
  encapsulation: ViewEncapsulation.None,
  imports: [NgFor, Watch, ContactForm],
  standalone: true
})
export class AboutPage{
  metaService = inject(MetaService)
  traktTvService = inject(TraktTvService)
  constructor(){
    this.metaService.setMetaTags(
      `About - ${profileData.name}`,
      'Dive into a curated space to learn more about the person behind the name',
      ['bio', 'biography', 'information', 'about', 'contact', 'detail']
      )
  }
  public aboutDetails =  [
    {
      title: 'What I Do',
      desc: `I design, automate, and maintain the systems that take code from a commit to production. My work
      covers building CI/CD pipelines, containerizing applications with Docker, managing Kubernetes clusters,
      provisioning cloud infrastructure as code, and setting up monitoring and alerting so issues are caught
      before users notice them. I focus on making deployments repeatable, environments consistent, and systems
      easy to scale.`
    },
    {
      title: 'Always Learning',
      desc: `The DevOps and cloud ecosystem moves fast, and I enjoy keeping up with it. Whether it's a new
      cloud service, a better way to manage infrastructure, or improving security and cost efficiency, I'm
      always exploring tools and practices that make systems more reliable.`
    },
    {
      title: 'Off-Duty Fun',
      desc: `Outside of work, I like experimenting with my own projects and home lab setups, reading tech blogs,
      listening to music, and spending quality time with my family and friends.`
    },
    {
      title: 'Why I Do DevOps',
      desc: `I enjoy removing friction between writing code and running it. Automating repetitive work, cutting
      deployment time, and keeping systems stable gives developers more time to build, and that's the impact
      I want to have.`
    },
  ];
  public contactInfo = [
    {
      title: 'Address',
      desc: `Gandhinagar, Gujarat, India`,
      link: 'https://www.google.com/maps/search/?api=1&query=Gandhinagar%2C+Gujarat%2C+India'
    },
    {
      title: 'Mobile Number',
      desc: '+91 9726208424',
      link: 'tel:+919726208424'
    },
    {
      title: 'Email',
      desc: 'jayeshhadiya018@gmail.com',
      link: 'mailto:jayeshhadiya018@gmail.com'
    }
  ]
}
