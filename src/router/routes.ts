import SurveyLayout from '@/layouts/SurveyLayout.vue'
import StartLayout from '@/layouts/StartLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

import SignIn from '@/views/authentication/SignIn.vue'
import SignUp from '@/views/authentication/SignUp.vue'

import RegisterCompany from '@/views/welcome/register/Company.vue'
import Invite from '@/views/welcome/invite/Invite.vue'

import RegisterPeople from '@/views/surveys/interview/RegisterPeople.vue'
import RegisterResponse from '@/views/surveys/interview/RegisterResponse.vue'
import ShareLink from '@/views/surveys/interview/ShareLink.vue'
import Congrats from '@/views/surveys/interview/Congrats.vue'
import Finished from '@/views/surveys/interview/Finished.vue'
import Survey from '@/views/surveys/survey/Survey.vue'
import Settings from '@/views/settings/Settings.vue'
import Surveys from '@/views/surveys/Surveys.vue'

import People from '@/views/people/People.vue'


export const routes = [
  {
    path: '/auth',
    component: StartLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: SignIn,
      },
      {
        name: 'register',
        path: 'register',
        component: SignUp,
      }
    ],
  },

  {
    path: '/welcome',
    name: 'welcome',
    component: StartLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'add-company',
        component: RegisterCompany,
      },

      {
        path: '/invite/:token',
        name: 'invite',
        component: Invite,
      }
    ],
  },

  {
    path: '/',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      requiresCompany: true,
    },
    children: [
      {
        path: '',
        redirect: { name: 'surveys' },
      },

      {
        path: 'surveys',
        children: [
          {
            path: '',
            name: 'surveys',
            component: Surveys,
          },
          {
            path: ':id',
            name: 'survey',
            component: Survey,
          },
        ]
      },

      {
        path: 'people',
        name: 'people',
        component: People,
      },

      {
        path: 'settings',
        name: 'settings',
        component: Settings,
      }
    ],
  },

  {
    path: '/survey',
    name: 'interview',
    component: SurveyLayout,
    children: [
      {
        path: ':id',
        name: 'register-people',
        component: RegisterPeople,
      },

      {
        path: ':id/:responseId',
        name: 'register-response',
        component: RegisterResponse,
      },

      {
        path: ':id/finished',
        name: 'finished',
        component: Finished,
      },

      {
        path: ':id/:responseId/share-link',
        name: 'share-link',
        component: ShareLink,
      },

      {
        path: 'congrats',
        name: 'congrats',
        component: Congrats,
      }
    ],
  }
]
