import { createRouter, createWebHistory } from 'vue-router';
import KanbanBoard from './components/KanbanBoard.vue';
import LoginForm from './components/LoginForm.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LoginForm
  },
  {
    path: '/kanban-board',
    name: 'KanbanBoard',
    component: KanbanBoard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
