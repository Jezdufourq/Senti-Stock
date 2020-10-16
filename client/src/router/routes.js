
// layouts
import MainLayout from 'layouts/MainLayout'

// pages
import Index from 'pages/Index'
import Analysis from 'pages/Analysis'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Index },
      { path: 'analysis', component: Analysis }
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
