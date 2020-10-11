
// layouts
import MainLayout from 'layouts/MainLayout'

// pages
import Index from 'pages/Index'
import Analysis from 'pages/Analysis'
import Register from 'pages/Register'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Index },
      { path: 'analysis', component: Analysis },
      { path: 'register', component: Register }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
