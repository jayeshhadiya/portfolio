import { SocialLinkSchema } from "@data/schema/social-links.schema";
import { envelope } from '@icon/solid.icon'
// import { github } from '@icon/brand.icon'


const socialLinkData: SocialLinkSchema[] = [
  // {
  //   name: 'Github',
  //   path: github,
  //   link: 'https://github.com/jayeshhadiya',
  //   color: '#c3c3c3',
  // },
  {
    name: 'Message',
    path: envelope,
    link: 'mailto:jayeshhadiya018@gmail.com?subject=Hi Jayesh!',
    color: '#e74c3c',
  },
];

export default socialLinkData;
