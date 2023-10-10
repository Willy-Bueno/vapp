import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import WelcomeLayout from '@/layouts/WelcomeLayout.vue'
import SurveyLayout from '@/layouts/SurveyLayout.vue'

import SignIn from '@/views/authentication/SignIn.vue'
import SignUp from '@/views/authentication/SignUp.vue'

import RegisterBusiness from '@/views/start/register/Business.vue'
import InviteWithLink from '@/views/start/invite/Invite.vue'


import SurveysOverview from '@/views/dashboard/questionnaires/Surveys.vue'
import Survey from '@/views/dashboard/questionnaires/questionnaire/Survey.vue'
import Settings from '@/views/dashboard/settings/Settings.vue'
import SaveParticipant from '@/views/dashboard/questionnaires/interview/SaveParticipant.vue'
import SaveResponse from '@/views/dashboard/questionnaires/interview/SaveResponse.vue'
import ShareLinkSurvey from '@/views/dashboard/questionnaires/interview/ShareLinkSurvey.vue'
import SurveyInterviewFinished from '@/views/dashboard/questionnaires/interview/SurveyInterviewFinished.vue'
import ThankYou from '@/views/dashboard/questionnaires/interview/ThankYou.vue'


export const routes = [
  {
    path: '/auth',
    component: AuthLayout,
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
    path: '/start',
    name: 'start',
    component: WelcomeLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'register-business',
        component: RegisterBusiness,
      },

      {
        path: 'invite/:token',
        name: 'invite',
        component: InviteWithLink,
      }
    ],
  },

  {
    path: '/',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      requiresBusinessInfos: true,
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        redirect: { name: 'surveys' },
      },

      {
        path: 'surveys',
        name: 'surveys',
        component: SurveysOverview,
      },

      {
        path: 'survey/:id',
        name: 'survey',
        component: Survey,
      },

      {
        path: 'settings',
        name: 'settings',
        component: Settings,
      },
    ],
  },

  {
    path: '/ask',
    component: SurveyLayout,
    children: [
      {
        path: 'participant/:surveyId',
        name: 'save-participant',
        component: SaveParticipant,
      },

      {
        path: 'share-link/:surveyId/:participantId',
        name: 'share-link',
        component: ShareLinkSurvey,
      },

      {
        path: ':surveyId/:participantId',
        name: 'save-response',
        component: SaveResponse,
      },

      {
        path: 'thank-you',
        name: 'thank-you',
        component: ThankYou,
      },

      {
        path: 'finished',
        name: 'survey-interview-finished',
        component: SurveyInterviewFinished,
      },
    ]
  }
]
