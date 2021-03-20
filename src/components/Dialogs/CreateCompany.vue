<template>
  <v-dialog v-model="dialog" max-width="350px" persistent>
    <v-card align="center">
      <v-card-title class="justify-center">
        Добавить нового резидента
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="name" label="Название" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="add" color="success">Добавить</v-btn>
        <v-btn @click="close" color="warning">Отмена</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog"],
  data() {
    return {
      name: "",
    };
  },
  methods: {
    add() {
      this.$store.dispatch("CREATE_COMPANY", { name: this.name, users: [] });
      this.close();
    },
    close() {
      this.$emit("close");
      this.name = "";
    },
  },
};
</script>