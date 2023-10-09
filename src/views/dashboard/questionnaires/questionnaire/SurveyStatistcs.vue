<script setup lang="ts">
import { ref, onMounted } from "vue";

import { useQuestionStore } from "@/stores/questions";
import { useQuestionOptionsStore } from "@/stores/questionOptions";
import { useResponseStore } from "@/stores/responses";

import { useRouter } from "vue-router";

import { StackedBar } from "@unovis/ts";
import {
  VisAxis,
  VisStackedBar,
  VisXYContainer,
  VisTooltip,
} from "@unovis/vue";

import { Card, CardContent } from "@/components/ui/card";

interface Statistc {
  id: string;
  title: string;
  value?: string[];
  options?: Array<{
    id: string;
    title: string;
    total: number;
  }>;
}

interface Data {
  id: string;
  title: string;
  total: number;
}

const router = useRouter();

const questionOptionsStore = useQuestionOptionsStore();
const questionStore = useQuestionStore();
const responseStore = useResponseStore();

const statistcs = ref<Statistc[]>([]);

const color = (
  d: Data,
  options: Array<{ id: string; title: string; total: number }>
) =>
  [
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
  ][options.findIndex((option) => option.id === d.id)];

const triggers = {
  [StackedBar.selectors.bar]: (d: Data) => `
    <div class="flex flex-col items-start">
      <div class="text-sm font-semibold text-gray-700">${d.title}</div>
      <div class="text-sm font-semibold text-gray-700">${d.total} respostas</div>
    </div>
  `,
};

const events = ref({})

function onClickBar () {
  events.value = {
    [StackedBar.selectors.bar]: {
      click: (d: Data) => {
        console.log(d);
      },
    }
  }
}

onMounted(async () => {
  const surveyId = router.currentRoute.value.params.id as string;

  await questionStore.getQuestionsBySurveyId(surveyId);
  await questionOptionsStore.getQuestionOptionsByQuestionIds(
    questionStore.questions.map((question) => question.id)
  );
  await responseStore.getResponsesBySurveyId(surveyId);

  questionStore.questions.forEach((question) => {
    if (question.type.slug !== "text") {
      const questionOptions = questionOptionsStore.options.filter(
        (option) => option.question.id === question.id
      );

      questionOptions.forEach((option) => {
        const total = responseStore.responses.filter(
          (response) =>
            response.question.id === question.id &&
            response.option?.id === option.id
        ).length;

        if (!statistcs.value.some((statistc) => statistc.id === question.id)) {
          statistcs.value.push({
            id: question.id,
            title: question.title,
            options: [
              {
                id: option.id,
                title: option.title,
                total,
              },
            ],
          });
        } else {
          statistcs.value
            .find((statistc) => statistc.id === question.id)
            ?.options?.push({
              id: option.id,
              title: option.title,
              total,
            });
        }
      });
    } else {
      statistcs.value.push({
        id: question.id,
        title: question.title,
        value: responseStore.responses
          .filter((response) => response.question.id === question.id)
          .map((response) => response.value) as string[],
      });
    }
  });
});
</script>

<template>
  <div>
    <div>
      <p class="text-sm text-muted-foreground">
        Veja as estatísticas de respostas do seu questionário.
      </p>
    </div>
  </div>
  <div class="flex flex-col space-y-16">
    <div v-for="statistc in statistcs" :key="statistc.id" class="flex flex-col gap-2">
      <div class="flex flex-col items-start">
        <div class="text-sm font-semibold">
          {{ statistc.title }}
        </div>
      </div>
      <Card v-if="statistc.options && !!statistc.options.length" class="w-fit">
        <CardContent class="p-6 flex">
          <div class="flex flex-col justify-end">
            <VisXYContainer
              height="250px"
              width="480px"
              :margin="{ left: 20, right: 20 }"
              :data="statistc.options"
            >
              <VisStackedBar
                :x="(_: Statistc, i: number) => i"
                :y="(d: Data) => d.total"
                :color="(d: Data) => color(d, statistc.options as Array<{ id: string, title: string, total: number }>)"
                :rounded-corners="4"
                :bar-padding="0.15"
                :cursor="(d: Data) => d.total > 0 ? 'pointer' : 'default'"
                :events="events"
              />
              <VisTooltip :triggers="triggers" />
              <VisAxis
                type="x"
                label="Movimente o mouse sobre as barras para ver mais detalhes"
                :num-ticks="statistc.options.length - 1"
                :grid-line="false"
                :tick-line="false"
                color="#888888"
              />
              <VisAxis
                type="y"
                :num-ticks="
                  statistc.options.reduce(
                    (gt, d) => (d.total > gt ? d.total : gt),
                    1
                  )
                "
                :tick-format="(d: Data) => d"
                :grid-line="false"
                :tick-line="false"
                :domain-line="false"
                color="#888888"
              />
            </VisXYContainer>
          </div>
          <div class="ml-12 flex flex-col gap-2">
            <div v-for="option in statistc.options" :key="option.id">
              <div
                class="flex flex-col items-start flex-start gap-1 p-2"
                :style="{ borderLeft: '4px solid ' + color(option, statistc.options as Array<{ id: string, title: string, total: number }>) }"
                @click="onClickBar()"
              >
                <span class="whitespace-nowrap">{{ option.title }}</span>
                <span class="text-muted-foreground whitespace-nowrap">{{ option.total }} {{ option.total > 1 ? 'votos' : 'voto' }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div v-else>
        <div class="w-fit">
          <div class="flex flex-col items-start space-y-8">
            <div class="text-sm text-muted-foreground">
              Essa é uma questão do tipo texto, não é possível gerar
              estatísticas. Confira as os questionários respondidos na aba de respostas.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
