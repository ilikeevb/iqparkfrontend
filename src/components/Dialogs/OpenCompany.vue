<template>
  <v-dialog v-model="dialog" max-width="350px" persistent>
    <v-card align="center">
      <v-card-title class="justify-center">
        {{ company.name }}
      </v-card-title>
      <v-card-text v-if="company.users.length > 0">
        <h3>Сотрудники</h3>
        <v-list-item v-for="user in company.users" :key="user.uid">
          <v-list-item-content>
            <v-list-item-title>
              {{ user.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
      <v-card-text v-else>
        <h3>У компании пока нет сотрудников</h3>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close" color="warning">Закрыть</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog", "company"],

  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>