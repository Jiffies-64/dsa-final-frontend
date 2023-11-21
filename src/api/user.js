import { post } from '@/utils/request'

export default {
  createUser: query => post('/api/student/user/edit', query),
  getCurrentUser: query => post('/api/student/user/current', query),
  getUserEvent: () => post('/api/student/user/log'),
  update: query => post('/api/student/user/update', query),
  messagePageList: query => post('/api/student/user/message/page', query),
  read: id => post('/api/student/user/message/read/' + id),
  getMessageCount: () => post('/api/student/user/message/unreadCount')
}
