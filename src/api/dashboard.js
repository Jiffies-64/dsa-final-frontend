import { post } from '@/utils/request'

export default {
  index: params => post('/api/student/dashboard/index', params),
  task: params => post('/api/student/dashboard/task', params)
}
