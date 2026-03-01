import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import BlogView from '../views/BlogView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import ContactView from '../views/ContactView.vue'
import FootprintsView from '../views/FootprintsView.vue'
import AlgorithmsHot100View from '../views/AlgorithmsHot100View.vue'
import IntersectionOfTwoLinkedListsView from '../views/IntersectionOfTwoLinkedListsView.vue'
import LowestCommonAncestorView from '../views/LowestCommonAncestorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioView,
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: BlogDetailView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/footprints',
      name: 'footprints',
      component: FootprintsView,
    },
    {
      path: '/algorithms/hot100',
      name: 'algorithms-hot100',
      component: AlgorithmsHot100View,
    },
    {
      path: '/algorithms/hot100/intersection-of-two-linked-lists',
      name: 'intersection-of-two-linked-lists',
      component: IntersectionOfTwoLinkedListsView,
    },
    {
      path: '/algorithms/hot100/lowest-common-ancestor-of-a-binary-tree',
      name: 'lowest-common-ancestor-of-a-binary-tree',
      component: LowestCommonAncestorView,
    },
  ],
})

export default router
