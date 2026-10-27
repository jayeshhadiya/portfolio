import { ExpertiseAreaSchema } from "@data/schema/expertise-area.schema";
import { pipeline, kubernetes, cloud, code, chart, terminal } from '@icon/regular.icon'


const expertiseAreaData: ExpertiseAreaSchema[] = [
  {
    icon: pipeline,
    percent: '85%',
    name: 'CI/CD Pipelines'
  },
  {
    icon: kubernetes,
    percent: '80%',
    name: 'Docker & Kubernetes'
  },
  {
    icon: cloud,
    percent: '75%',
    name: 'Cloud Infrastructure (AWS)'
  },
  {
    icon: code,
    percent: '70%',
    name: 'Infrastructure as Code'
  },
  {
    icon: chart,
    percent: '70%',
    name: 'Monitoring & Logging'
  },
  {
    icon: terminal,
    percent: '80%',
    name: 'Linux & Shell Scripting'
  },
]

export default expertiseAreaData
